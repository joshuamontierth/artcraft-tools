<#
.SYNOPSIS
  Optional: block all OUTBOUND internet traffic for the ArtCraft executables with Windows Firewall rules.

.DESCRIPTION
  Defense in depth while the apps are still unvetted. The security review found no telemetry, but this
  guarantees the built apps can't reach the internet even if a future commit slips something in.
  Loopback (127.0.0.1) is not filtered by Windows Firewall, so the Claude Code MCP bridges keep working.
  Side effect: optional downloads stop working (LightCraft face/denoise models, FilmCraft or PdfCraft
  update checks and models, PdfCraft signature revocation checks).
  Needs administrator rights; the script relaunches itself elevated. Re-run after new apps are built.

.EXAMPLE
  .\harden-firewall.ps1
  .\harden-firewall.ps1 -Remove
#>
[CmdletBinding()]
param([switch]$Remove)

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    $a = '-NoProfile -ExecutionPolicy Bypass -File "{0}"{1}' -f $PSCommandPath, $(if ($Remove) { ' -Remove' } else { '' })
    Start-Process -FilePath (Get-Process -Id $PID).Path -ArgumentList $a -Verb RunAs
    exit 0
}
. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')
$prefix = 'ArtCraft block outbound - '
Get-NetFirewallRule -DisplayName "$prefix*" -ErrorAction SilentlyContinue | Remove-NetFirewallRule
if ($Remove) { Write-Host 'Removed ArtCraft firewall rules.'; Start-Sleep 3; exit 0 }
foreach ($r in (Get-ArtcraftRepos)) {
    foreach ($kind in 'gui', 'cli') {
        $exe = Get-ExePath $r $kind
        if (Test-Path $exe) {
            New-NetFirewallRule -DisplayName ($prefix + (Split-Path $exe -Leaf)) -Direction Outbound -Program $exe -Action Block -Profile Any | Out-Null
            Write-Host "blocked outbound: $exe"
        }
    }
}
Write-Host 'Done.'
Start-Sleep 3
