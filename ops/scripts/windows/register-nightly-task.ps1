<#
.SYNOPSIS
  Register (or remove) the Windows Task Scheduler job that runs nightly-update.ps1.

.DESCRIPTION
  Creates the task "ArtCraft Nightly Update" for the current user, daily at -At (default 03:00).
  It runs only while you are logged on, so no password is stored, and it catches up at the next logon
  if the PC was off. No administrator rights are needed.

.EXAMPLE
  .\register-nightly-task.ps1                 # daily at 3:00 AM, pull + scan + build
  .\register-nightly-task.ps1 -At 01:30 -NoBuild
  .\register-nightly-task.ps1 -Unregister
#>
[CmdletBinding()]
param([string]$At = '03:00', [switch]$NoBuild, [switch]$Unregister, [string]$TaskName = 'ArtCraft Nightly Update')

if ($Unregister) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "Removed scheduled task '$TaskName' (if it existed)."
    exit 0
}

$script = Join-Path $PSScriptRoot 'nightly-update.ps1'
$psExe = (Get-Command pwsh -ErrorAction SilentlyContinue).Source
if (-not $psExe) { $psExe = (Get-Command powershell).Source }
$argLine = '-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}"{1}' -f $script, $(if ($NoBuild) { ' -NoBuild' } else { '' })

$action   = New-ScheduledTaskAction -Execute $psExe -Argument $argLine -WorkingDirectory $PSScriptRoot
$trigger  = New-ScheduledTaskTrigger -Daily -At $At
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries `
            -ExecutionTimeLimit (New-TimeSpan -Hours 8) -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal `
    -Description ('Pull ArtCraft repos, run the static security gate, build only what passes. See ' + (Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'reports\LATEST.md')) -Force | Out-Null
Write-Host "Registered '$TaskName': daily at $At -> $psExe $argLine"
Write-Host "Run it now with:  Start-ScheduledTask -TaskName '$TaskName'"
