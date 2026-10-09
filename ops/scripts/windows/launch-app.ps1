<#
.SYNOPSIS
  Start an ArtCraft app with its loopback-only automation channel on, so Claude Code (MCP) can drive it.

.EXAMPLE
  .\launch-app.ps1 -App photocraft
  .\launch-app.ps1 -App lightcraft -NoControl            # plain launch, no agent channel
  .\launch-app.ps1 -App filmcraft -Files D:\clips\a.mp4
#>
[CmdletBinding()]
param([Parameter(Mandatory = $true)][string]$App, [switch]$NoControl, [string[]]$Files)

. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')
$r = Get-ArtcraftRepos -Only $App | Select-Object -First 1
if (-not $r) { Write-Host "Unknown app '$App'. Known: $((Get-ArtcraftConfig).name -join ', ')"; exit 2 }
$exe = Get-ExePath $r 'gui'
if (-not (Test-Path $exe)) { Write-Host "$exe not built yet. Run build-approved.ps1 -Repos $($r.name)" -ForegroundColor Red; exit 2 }

$work = Get-WorkDir $r
New-Item -ItemType Directory -Force -Path $work, (Join-Path $work 'practice'), (Join-Path $work 'exports') | Out-Null
$argv = @()
if (-not $NoControl -and $r.control_port) {
    if ($r.token_file) { Initialize-PrivateDir (Split-Path (Get-TokenFile $r)) }
    $argv += Expand-RepoArgs $r $r.gui_args
}
if ($Files) { $argv += $Files }
$argString = ($argv | ForEach-Object { if ($_ -match '\s') { '"' + $_ + '"' } else { $_ } }) -join ' '
Write-Host "Starting $exe $argString"
if ($argString) { Start-Process -FilePath $exe -ArgumentList $argString -WorkingDirectory $work }
else { Start-Process -FilePath $exe -WorkingDirectory $work }
