<#
.SYNOPSIS
  Create Start-menu shortcuts (Start > ArtCraft) for every built app, plus the courses and the reports.

.DESCRIPTION
  "<App> (ArtCraft)" starts the app with its loopback-only control channel (the port from
  ops\config\repos.json), which the Claude Code MCP bridge connects to. "<App> (no agent)" starts it plainly.
  Re-run any time; existing shortcuts are overwritten. Runs automatically at the end of build-approved.ps1.
#>
[CmdletBinding()]
param([switch]$Remove)

. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')
$folder = Join-Path ([Environment]::GetFolderPath('Programs')) 'ArtCraft'
if ($Remove) { Remove-Item -Recurse -Force $folder -ErrorAction SilentlyContinue; Write-Host "Removed $folder"; exit 0 }
New-Item -ItemType Directory -Force -Path $folder | Out-Null
$shell = New-Object -ComObject WScript.Shell

function New-Shortcut([string]$Name, [string]$Target, [string]$Arguments, [string]$WorkDir, [string]$Icon, [string]$Description) {
    $lnk = $shell.CreateShortcut((Join-Path $folder ($Name + '.lnk')))
    $lnk.TargetPath = $Target
    if ($Arguments) { $lnk.Arguments = $Arguments }
    if ($WorkDir) { $lnk.WorkingDirectory = $WorkDir }
    if ($Icon) { $lnk.IconLocation = $Icon }
    if ($Description) { $lnk.Description = $Description }
    $lnk.Save()
}

$made = @()
foreach ($r in (Get-ArtcraftRepos)) {
    $exe = Get-ExePath $r 'gui'
    if (-not (Test-Path $exe)) { continue }
    $work = Get-WorkDir $r
    New-Item -ItemType Directory -Force -Path $work, (Join-Path $work 'practice'), (Join-Path $work 'exports') | Out-Null
    if ($r.control_port) {
        if ($r.token_file) { Initialize-PrivateDir (Split-Path (Get-TokenFile $r)) }
        $a = (Expand-RepoArgs $r $r.gui_args | ForEach-Object { if ($_ -match '\s') { '"' + $_ + '"' } else { $_ } }) -join ' '
        New-Shortcut "$($r.title) (ArtCraft)" $exe $a $work "$exe,0" "$($r.title) with the Claude Code control channel on 127.0.0.1:$($r.control_port)"
        New-Shortcut "$($r.title) (no agent)" $exe '' $work "$exe,0" "$($r.title) without the automation channel"
    } else {
        New-Shortcut "$($r.title) (ArtCraft)" $exe '' $work "$exe,0" $r.title
    }
    $made += $r.title
}
$courses = Join-Path $script:ArtcraftRoot 'courses\index.html'
if (Test-Path $courses) { New-Shortcut 'ArtCraft Courses' $courses '' (Split-Path $courses) '' 'Beginner courses for PhotoCraft, LightCraft and FilmCraft' }
$report = Join-Path $script:OpsDir 'reports\LATEST.md'
New-Shortcut 'ArtCraft Nightly Report' 'notepad.exe' ('"' + $report + '"') '' '' 'Latest nightly pull/scan/build summary'
Write-Host "Shortcuts in Start > ArtCraft for: $(if ($made) { $made -join ', ' } else { '(no apps built yet)' }), plus Courses and Nightly Report."
