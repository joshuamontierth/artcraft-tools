<#
.SYNOPSIS
  One-time Windows setup for building the ArtCraft apps. Installs toolchains; builds and runs NOTHING.

.DESCRIPTION
  Installs (via winget) whatever is missing:
    - Visual Studio 2022 Build Tools with the C++ workload (MSVC linker + Windows SDK). Shows a UAC prompt.
    - Rust (rustup, stable x86_64-pc-windows-msvc toolchain), per-user.
    - NASM and CMake, which some -sys crates use on Windows (e.g. aws-lc-sys in PdfCraft). Skip with -SkipNativeTools.
  Also creates %USERPROFILE%\ArtCraft\<App> work folders (agents may read and write there) and a private,
  user-only folder for control-channel tokens.

  It does not compile any ArtCraft code. When it's done:
    1. Read SECURITY-REPORT.md (toolkit root)
    2. .\nightly-update.ps1 -NoBuild      (clones any missing app repos; first install only)
       .\adopt-audit-baseline.ps1         (first install only: trust the published audit)
       .\build-approved.ps1               (builds only gate-approved repos)
    3. .\register-mcp.ps1                 (lets Claude Code drive the apps)
    4. .\register-nightly-task.ps1        (nightly pull + scan + build)

.PARAMETER SkipBuildTools   Don't install the Visual Studio Build Tools.
.PARAMETER SkipNativeTools  Don't install NASM/CMake.
.PARAMETER WithAuditTools   Also `cargo install cargo-audit --locked` (compiles that well-known tool from crates.io).
#>
[CmdletBinding()]
param([switch]$SkipBuildTools, [switch]$SkipNativeTools, [switch]$WithAuditTools)

$ErrorActionPreference = 'Continue'
. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')

function Install-WithWinget {
    param([string]$Id, [string]$Override = '')
    Write-Host "winget install $Id" -ForegroundColor Cyan
    $wargs = @('install', '--id', $Id, '-e', '--source', 'winget', '--accept-source-agreements', '--accept-package-agreements')
    if ($Override) { $wargs += @('--override', $Override) }
    & winget @wargs
    return $LASTEXITCODE
}

function Update-SessionPath {
    $m = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $u = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$m;$u;$env:USERPROFILE\.cargo\bin"
}

Write-Section 'Checking prerequisites'
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host 'winget is missing. Install "App Installer" from the Microsoft Store, then re-run.' -ForegroundColor Red
    exit 2
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Install-WithWinget 'Git.Git' | Out-Null; Update-SessionPath }
try { $py = Find-Python; Write-Host "Python: $($py -join ' ')" } catch { Install-WithWinget 'Python.Python.3.12' | Out-Null; Update-SessionPath }

# --- MSVC build tools -------------------------------------------------------------------
Write-Section 'MSVC C++ build tools'
$vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
$hasMsvc = $false
if (Test-Path $vswhere) {
    $inst = & $vswhere -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath 2>$null
    if ($inst) { $hasMsvc = $true; Write-Host "Found MSVC tools: $inst" }
}
if (-not $hasMsvc -and -not $SkipBuildTools) {
    Write-Host 'Installing Visual Studio 2022 Build Tools (C++ workload, about 6 GB). Approve the UAC prompt.' -ForegroundColor Yellow
    $code = Install-WithWinget 'Microsoft.VisualStudio.2022.BuildTools' '--wait --passive --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended'
    if ($code -ne 0) { Write-Host "Build Tools install returned $code. If it failed, install 'Desktop development with C++' manually from https://visualstudio.microsoft.com/visual-cpp-build-tools/" -ForegroundColor Yellow }
}

# --- Rust ---------------------------------------------------------------------------------
Write-Section 'Rust toolchain'
Update-SessionPath
if (-not (Find-Cargo)) {
    Install-WithWinget 'Rustlang.Rustup' | Out-Null
    Update-SessionPath
}
$rustup = Join-Path $env:USERPROFILE '.cargo\bin\rustup.exe'
if (Test-Path $rustup) {
    & $rustup default stable-x86_64-pc-windows-msvc
    & $rustup update stable
    Write-Host (& (Join-Path $env:USERPROFILE '.cargo\bin\rustc.exe') --version)
} else {
    Write-Host 'rustup not found after install. Install from https://rustup.rs and re-run.' -ForegroundColor Red
}

# --- native helpers -----------------------------------------------------------------------
if (-not $SkipNativeTools) {
    Write-Section 'NASM and CMake (used by some -sys crates)'
    if (-not (Get-Command nasm -ErrorAction SilentlyContinue) -and -not (Test-Path "$env:ProgramFiles\NASM\nasm.exe")) { Install-WithWinget 'NASM.NASM' | Out-Null }
    if (-not (Get-Command cmake -ErrorAction SilentlyContinue)) { Install-WithWinget 'Kitware.CMake' | Out-Null }
    $nasmDir = "$env:ProgramFiles\NASM"
    if ((Test-Path $nasmDir) -and ([Environment]::GetEnvironmentVariable('Path', 'User') -notlike "*$nasmDir*")) {
        [Environment]::SetEnvironmentVariable('Path', ([Environment]::GetEnvironmentVariable('Path', 'User') + ";$nasmDir"), 'User')
        Write-Host "Added $nasmDir to your user PATH."
    }
}

# --- folders --------------------------------------------------------------------------------
Write-Section 'Work folders'
foreach ($r in (Get-ArtcraftRepos)) {
    $w = Get-WorkDir $r
    New-Item -ItemType Directory -Force -Path $w, (Join-Path $w 'practice'), (Join-Path $w 'exports') | Out-Null
    Write-Host "  $w"
}
Initialize-PrivateDir (Join-Path $env:LOCALAPPDATA 'ArtCraft\tokens')
Write-Host "  token folder (user-only ACL): $env:LOCALAPPDATA\ArtCraft\tokens"

# Windows can't track the executable bit; make sure git doesn't report every script as modified.
foreach ($r in (Get-ArtcraftRepos)) {
    $p = Get-RepoPath $r
    if (Test-Path (Join-Path $p '.git')) { & git -C $p config core.fileMode false }
}

if ($WithAuditTools) {
    Write-Section 'cargo-audit'
    $cargo = Find-Cargo
    if ($cargo) { & $cargo install cargo-audit --locked }
}

Write-Section 'Done'
Write-Host @"
Next steps (open a NEW terminal so PATH changes apply):
  1. Read  $(Join-Path $script:ArtcraftRoot 'SECURITY-REPORT.md')
  2. cd $PSScriptRoot
     .\nightly-update.ps1 -NoBuild          (first install: clones the app repos, scans; builds nothing)
     .\adopt-audit-baseline.ps1             (first install: trust the published audit's commits)
     .\build-approved.ps1 -Repos photocraft,lightcraft,filmcraft     (first build: 5-20 min per app)
  3. .\register-mcp.ps1                     (registers the apps with Claude Code)
  4. .\register-nightly-task.ps1            (nightly pull + scan + build at 3 AM)
  5. Open $(Join-Path $script:ArtcraftRoot 'courses\index.html')
"@
