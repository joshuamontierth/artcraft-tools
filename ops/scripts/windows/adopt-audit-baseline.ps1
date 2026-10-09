<#
.SYNOPSIS
  Trust the published security audit: use its reviewed commits as your gate baselines.

.DESCRIPTION
  A fresh install has no approved commit for any repo, so the gate reports needs-baseline and nothing
  builds. This script sets each repo's baseline to the commit reviewed in the toolkit's audit
  (ops\security\audit\baselines.txt, report in SECURITY-REPORT.md), then runs the gate. The gate scans every
  commit from the audited one to your HEAD, so only that audit and the automated scan stand between
  the code and a build. Read SECURITY-REPORT.md first and decide whether you trust that audit.
  Repos that already have a baseline are left alone.

.EXAMPLE
  .\adopt-audit-baseline.ps1
  .\adopt-audit-baseline.ps1 -Repos photocraft,lightcraft,filmcraft
#>
[CmdletBinding()]
param([string[]]$Repos, [switch]$Yes)

. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')
$file = Join-Path $script:OpsDir 'security\audit\baselines.txt'
Write-Host "Audited commits: $file"
Get-Content $file | Where-Object { $_ -and -not $_.StartsWith('#') } | ForEach-Object { Write-Host "  $_" }
if (-not $Yes) {
    $ans = Read-Host 'Use these audited commits as your security-gate baselines? (type yes)'
    if ($ans -ne 'yes') { Write-Host 'Nothing changed.'; exit 1 }
}

$rows = @()
foreach ($r in (Get-ArtcraftRepos -Only $Repos)) {
    Write-Section $r.name
    if (-not (Test-Path (Join-Path (Get-RepoPath $r) '.git'))) { Write-Host 'not cloned; run nightly-update.ps1 -NoBuild first'; continue }
    $a = Invoke-Scanner @('adopt-baseline', '--root', $script:ArtcraftRoot, '--repo', $r.name)
    $g = if ($a -eq 0) { Invoke-Scanner @('gate', '--root', $script:ArtcraftRoot, '--repo', $r.name) } else { $a }
    $rows += [pscustomobject]@{ Repo = $r.name; Gate = $(switch ($g) { 0 { 'clean' } 10 { 'FLAGGED' } default { "error ($g)" } }) }
}
Write-Host ''
$rows | Format-Table -AutoSize | Out-String | Write-Host
Write-Host 'Clean repos can be built with build-approved.ps1. For FLAGGED ones, see ops\reports and SECURITY-SCAN-GUIDE.md.'
