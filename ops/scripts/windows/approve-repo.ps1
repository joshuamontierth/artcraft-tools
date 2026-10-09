<#
.SYNOPSIS
  Record that you reviewed a repo's flagged changes and accept its current commit as the new baseline.

.DESCRIPTION
  Shows the latest gate report path and blocking findings, asks for confirmation, then moves the
  gate baseline (last approved commit) to HEAD. Future nightly scans only look at newer commits.
  Only approve after you (or an agent following ops\security\SECURITY-SCAN-GUIDE.md) have read the
  flagged diff.

.EXAMPLE
  .\approve-repo.ps1 -Repo photocraft -Note "xcap screen capture is the eyedropper feature, user-triggered"
#>
[CmdletBinding()]
param([Parameter(Mandatory = $true)][string]$Repo, [string]$Note = '', [switch]$Yes)

. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')
$statePath = Join-Path $script:OpsDir 'state\scan-state.json'
if (Test-Path $statePath) {
    $st = Get-Content -Raw $statePath | ConvertFrom-Json
    if ($st.repos.PSObject.Properties.Name -contains $Repo) {
        $rs = $st.repos.$Repo
        Write-Host "Status: $($rs.status)"
        if ($rs.PSObject.Properties.Name -contains 'last_report') {
            $rep = Join-Path $script:ArtcraftRoot $rs.last_report
            Write-Host "Latest report: $rep"
            if (Test-Path $rep) {
                Get-Content $rep | Select-String -Pattern '^\| (CRITICAL|HIGH) ' | ForEach-Object { Write-Host $_.Line -ForegroundColor Yellow }
            }
        }
    }
}
$head = (Invoke-Git (Join-Path $script:ArtcraftRoot $Repo) @('log', '-1', '--format=%h %cd %s', '--date=short')).Out
Write-Host "HEAD: $head"
if (-not $Yes) {
    $ans = Read-Host "Approve $Repo at this commit as reviewed and clean? (type yes)"
    if ($ans -ne 'yes') { Write-Host 'Not approved.'; exit 1 }
}
exit (Invoke-Scanner @('approve', '--root', $script:ArtcraftRoot, '--repo', $Repo, '--note', $Note))
