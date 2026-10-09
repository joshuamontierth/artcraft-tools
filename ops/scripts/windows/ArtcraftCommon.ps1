# ArtcraftCommon.ps1: shared helpers for the ArtCraft ops scripts (dot-source this file).
# Works in Windows PowerShell 5.1 and PowerShell 7+.

Set-StrictMode -Version 2.0

$script:OpsDir       = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)          # ...\ops
$script:ArtcraftRoot = Split-Path -Parent $script:OpsDir                               # folder holding the repos
$script:ScannerPath  = Join-Path $script:OpsDir 'security\scanner\artcraft_scan.py'
$script:ConfigPath   = Join-Path $script:OpsDir 'config\repos.json'

function Get-ArtcraftConfig {
    $cfg = Get-Content -Raw -Path $script:ConfigPath | ConvertFrom-Json
    return $cfg.repos
}

function Split-NameList {
    # Normalizes list parameters: accepts @('a','b'), 'a,b' or 'a b'; returns lower-case names.
    param([string[]]$Names)
    return @($Names | ForEach-Object { $_ -split '[,\s]+' } | Where-Object { $_ } | ForEach-Object { $_.ToLower() })
}

function Get-ArtcraftRepos {
    param([string[]]$Only)
    $repos = Get-ArtcraftConfig
    if ($Only -and $Only.Count -gt 0) {
        # `powershell -File x.ps1 -Repos a,b` passes the single string "a,b", so split on commas too.
        $wanted = @(Split-NameList $Only)
        $unknown = $wanted | Where-Object { ($repos | ForEach-Object name) -notcontains $_ }
        if ($unknown) { Write-Host ("Unknown repo name(s): {0}. Known: {1}" -f ($unknown -join ', '), (($repos | ForEach-Object name) -join ', ')) -ForegroundColor Yellow }
        $repos = $repos | Where-Object { $wanted -contains $_.name }
    }
    return $repos
}

function Find-Python {
    # Returns @(exe, extra args) for a Python >= 3.8.
    $candidates = @(@('py', '-3'), @('python3'), @('python'))
    foreach ($c in $candidates) {
        $exe = Get-Command $c[0] -ErrorAction SilentlyContinue
        if (-not $exe) { continue }
        $extra = @($c | Select-Object -Skip 1)
        try {
            $v = & $exe.Source @extra -c "import sys; print('%d.%d' % sys.version_info[:2])" 2>$null
            if ($v -and ([version]$v -ge [version]'3.8')) {
                $result = @($exe.Source) + $extra
                return ,$result
            }
        } catch { }
    }
    throw 'Python 3.8+ was not found. Install it (winget install Python.Python.3.12) and re-run.'
}

function Invoke-Scanner {
    # Runs artcraft_scan.py with the given arguments; returns the exit code. Output goes to the host/log.
    param([string[]]$Arguments)
    $py = Find-Python
    $exe = $py[0]; $pre = @($py | Select-Object -Skip 1)
    & $exe @pre $script:ScannerPath @Arguments | ForEach-Object { Write-Host $_ }
    return $LASTEXITCODE
}

function Find-Cargo {
    $c = Get-Command cargo -ErrorAction SilentlyContinue
    if ($c) { return $c.Source }
    $p = Join-Path $env:USERPROFILE '.cargo\bin\cargo.exe'
    if (Test-Path $p) { return $p }
    return $null
}

function Invoke-Git {
    # Runs git in a repo; returns @{ Code; Out }.
    param([string]$Repo, [string[]]$Arguments)
    $out = & git -C $Repo -c core.quotepath=off @Arguments 2>&1 | Out-String
    return @{ Code = $LASTEXITCODE; Out = $out.Trim() }
}

function Get-RepoPath { param($Repo) return (Join-Path $script:ArtcraftRoot $Repo.name) }

function Get-ExePath {
    param($Repo, [ValidateSet('gui', 'cli')] [string]$Kind = 'gui')
    $name = if ($Kind -eq 'gui') { $Repo.gui_exe } else { $Repo.cli_exe }
    return (Join-Path (Get-RepoPath $Repo) ("target\release\{0}.exe" -f $name))
}

function Get-WorkDir {
    param($Repo)
    return (Join-Path $env:USERPROFILE ("ArtCraft\{0}" -f $Repo.title))
}

function Get-TokenFile {
    param($Repo)
    return (Join-Path $env:LOCALAPPDATA ("ArtCraft\tokens\{0}-control.token" -f $Repo.name))
}

function Initialize-PrivateDir {
    # Creates a directory readable only by the current user (for control tokens).
    param([string]$Path)
    if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Force -Path $Path | Out-Null }
    $me = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    & icacls $Path /inheritance:r /grant:r "${me}:(OI)(CI)F" 2>&1 | Out-Null
}

function Expand-RepoArgs {
    # Replaces {port}, {token_file}, {work_dir} placeholders in a config argument list.
    param($Repo, $ArgList)
    if ($null -eq $ArgList) { return $null }
    $out = @()
    foreach ($a in $ArgList) {
        $s = [string]$a
        $s = $s.Replace('{port}', [string]$Repo.control_port)
        $s = $s.Replace('{token_file}', (Get-TokenFile $Repo))
        $s = $s.Replace('{work_dir}', (Get-WorkDir $Repo))
        $out += $s
    }
    return ,$out
}

function Invoke-RepoBuild {
    # Builds one repo's configured packages with `cargo build --release --locked`.
    # Only call this for a repo whose HEAD passed the gate (should-build exit 0). Returns a status string.
    param($Repo, [string]$Cargo, [string]$LogDir, [int]$Jobs = 0)
    $path = Get-RepoPath $Repo
    New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
    $blog = Join-Path $LogDir ("{0}-build.log" -f $Repo.name)
    $cargoArgs = @('build', '--release', '--locked')
    foreach ($p in $Repo.build_packages) { $cargoArgs += @('-p', $p) }
    if ($Jobs -gt 0) { $cargoArgs += @('-j', [string]$Jobs) }
    Write-Host ("cargo {0}  (log: {1})" -f ($cargoArgs -join ' '), $blog)
    $t0 = Get-Date
    Push-Location $path
    try {
        # cmd.exe redirection keeps cargo's stderr as plain text (PowerShell 5.1 would wrap it).
        & cmd.exe /d /c ('"{0}" {1} > "{2}" 2>&1' -f $Cargo, ($cargoArgs -join ' '), $blog)
        $code = $LASTEXITCODE
    } finally { Pop-Location }
    $mins = [Math]::Round(((Get-Date) - $t0).TotalMinutes, 1)
    $sha = (Invoke-Git $path @('rev-parse', 'HEAD')).Out
    if ($code -eq 0) {
        Invoke-Scanner @('mark-built', '--repo', $Repo.name, '--sha', $sha, '--result', 'ok') | Out-Null
        return "ok ($mins min)"
    }
    Invoke-Scanner @('mark-built', '--repo', $Repo.name, '--sha', $sha, '--result', 'failed') | Out-Null
    $hint = ''
    if (Select-String -Path $blog -Pattern 'Access is denied|being used by another process' -Quiet) { $hint = ' (app was running? close it and retry)' }
    elseif (Select-String -Path $blog -Pattern 'link\.exe|linker .* not found|LNK1' -Quiet) { $hint = ' (MSVC build tools missing? run setup-windows.ps1)' }
    return "FAILED ($mins min)$hint, see $blog"
}

function Get-Stamp { return (Get-Date -Format 'yyyy-MM-dd') }

function Write-Section { param([string]$Text) Write-Host ''; Write-Host ('== ' + $Text) -ForegroundColor Cyan }
