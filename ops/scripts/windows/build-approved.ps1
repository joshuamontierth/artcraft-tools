<#
.SYNOPSIS
  Build the ArtCraft apps whose current commit passed the security gate (or was approved by you).

.DESCRIPTION
  For each repo it re-runs the gate on the checked-out commit (scanning anything new since the
  approved baseline), then runs `cargo build --release --locked` for repos that pass. Afterwards it
  creates Start-menu shortcuts for the apps that built successfully.
  It does not pull. Use nightly-update.ps1 for that.

.PARAMETER Repos   Only these repos (default: all in ops\config\repos.json).
.PARAMETER Force   Rebuild even if the approved commit was already built.
.PARAMETER Jobs    cargo -j value.

.EXAMPLE
  .\build-approved.ps1 -Repos photocraft,lightcraft,filmcraft
#>
[CmdletBinding()]
param([string[]]$Repos, [switch]$Force, [int]$Jobs = 0)

$ErrorActionPreference = 'Continue'
. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')

$cargo = Find-Cargo
if (-not $cargo) { Write-Host 'cargo not found. Run setup-windows.ps1 first (then open a new terminal).' -ForegroundColor Red; exit 2 }
$logDir = Join-Path $script:OpsDir ("logs\{0}" -f (Get-Stamp))
$rows = @()
foreach ($r in (Get-ArtcraftRepos -Only $Repos)) {
    Write-Section $r.name
    if (-not (Test-Path (Join-Path (Get-RepoPath $r) '.git'))) { $rows += "$($r.name): not cloned"; continue }
    $gate = Invoke-Scanner @('gate', '--root', $script:ArtcraftRoot, '--repo', $r.name)
    if ($gate -ne 0) { $rows += "$($r.name): NOT BUILT, gate says flagged/needs-baseline (see ops\state\scan-state.json and the report)"; continue }
    $sbArgs = @('should-build', '--root', $script:ArtcraftRoot, '--repo', $r.name)
    if ($Force) { $sbArgs += '--force' }
    $should = Invoke-Scanner $sbArgs
    if ($should -eq 1) { $rows += "$($r.name): already built at this commit (use -Force to rebuild)"; continue }
    if ($should -ne 0) { $rows += "$($r.name): not approved"; continue }
    $status = Invoke-RepoBuild -Repo $r -Cargo $cargo -LogDir $logDir -Jobs $Jobs
    $rows += "$($r.name): $status"
}
Write-Section 'Summary'
$rows | ForEach-Object { Write-Host $_ }
& (Join-Path $PSScriptRoot 'install-shortcuts.ps1')
