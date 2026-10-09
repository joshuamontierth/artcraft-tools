<#
.SYNOPSIS
  Nightly ArtCraft update: pull every repo, security-gate the new commits, and build only what passes.

.DESCRIPTION
  For each repo in ops\config\repos.json:
    1. Clone it if it's missing. Otherwise fast-forward to origin/<branch> (it never merges, rebases,
       or discards local changes; a dirty or diverged repo is skipped and reported).
    2. Run the static security gate (ops\security\scanner\artcraft_scan.py gate). It scans every commit
       since the last approved commit and NEVER executes repository code.
    3. If the gate is clean and Rust is installed, run `cargo build --release --locked` for the app's
       packages. A flagged repo is pulled but NOT built; read its report, then approve it
       (approve-repo.ps1) or wait for upstream to fix it.
  Writes a summary to ops\reports\nightly-<date>.md and ops\reports\LATEST.md, with logs in ops\logs\<date>\.

  Building runs build scripts and proc-macros from the repos and their dependencies. That is why it
  only happens after the gate passes.

.PARAMETER Repos     Only process these repos (names from repos.json).
.PARAMETER NoBuild   Pull and scan only. Never build.
.PARAMETER NoPull    Don't fetch; just gate (and build) what's already checked out.
.PARAMETER Jobs      cargo -j value (default: cargo's default).

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File nightly-update.ps1 -NoBuild
#>
[CmdletBinding()]
param(
    [string[]]$Repos,
    [switch]$NoBuild,
    [switch]$NoPull,
    [int]$Jobs = 0
)

$ErrorActionPreference = 'Continue'
. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')

$stamp   = Get-Stamp
$logDir  = Join-Path $script:OpsDir ("logs\{0}" -f $stamp)
$repDir  = Join-Path $script:OpsDir 'reports'
New-Item -ItemType Directory -Force -Path $logDir, $repDir | Out-Null
$transcript = Join-Path $logDir ("nightly-{0}.log" -f (Get-Date -Format 'HHmmss'))
try { Start-Transcript -Path $transcript -Append | Out-Null } catch { }

# One run at a time: a lock file in ops\state.
$lock = Join-Path $script:OpsDir 'state\nightly.lock'
New-Item -ItemType Directory -Force -Path (Split-Path $lock) | Out-Null
if (Test-Path $lock) {
    # The lock holds the PID of the run that created it; treat it as stale if that process is gone.
    $holder = 0; [void][int]::TryParse(((Get-Content $lock -ErrorAction SilentlyContinue) -join '').Trim(), [ref]$holder)
    $proc = if ($holder -gt 0) { Get-Process -Id $holder -ErrorAction SilentlyContinue } else { $null }
    $age = (Get-Date) - (Get-Item $lock).LastWriteTime
    if ($proc -and $proc.ProcessName -match 'powershell|pwsh' -and $age.TotalHours -lt 12) {
        Write-Host "Another nightly run is in progress (PID $holder, lock $lock). Exiting."; exit 3
    }
}
Set-Content -Path $lock -Value $PID

$cargo = Find-Cargo
if (-not $cargo -and -not $NoBuild) {
    Write-Host 'cargo not found: builds will be skipped. Run ops\scripts\windows\setup-windows.ps1 first.' -ForegroundColor Yellow
}

$results = @()
$started = Get-Date
try {
    foreach ($r in (Get-ArtcraftRepos -Only $Repos)) {
        $path = Get-RepoPath $r
        $row = [ordered]@{ Repo = $r.name; Before = ''; After = ''; Commits = 0; Pull = ''; Gate = ''; Build = ''; Report = '' }
        Write-Section $r.name

        # --- 1. clone or fast-forward -------------------------------------------------
        if (-not (Test-Path (Join-Path $path '.git'))) {
            if ($NoPull) { $row.Pull = 'missing'; $results += [pscustomobject]$row; continue }
            Write-Host "Cloning $($r.url)"
            & git -c core.fileMode=false clone --branch $r.branch $r.url $path 2>&1 | Write-Host
            if ($LASTEXITCODE -ne 0) { $row.Pull = 'clone FAILED'; $results += [pscustomobject]$row; continue }
            & git -C $path config core.fileMode false
            $row.Pull = 'cloned'
        }
        & git -C $path config core.fileMode false
        $row.Before = (Invoke-Git $path @('rev-parse', 'HEAD')).Out
        if (-not $NoPull -and $row.Pull -ne 'cloned') {
            $dirty = (Invoke-Git $path @('status', '--porcelain', '--untracked-files=no')).Out
            $branch = (Invoke-Git $path @('rev-parse', '--abbrev-ref', 'HEAD')).Out
            if ($dirty) {
                $row.Pull = 'SKIPPED: local changes'
            } elseif ($branch -ne $r.branch) {
                $row.Pull = "SKIPPED: on branch '$branch', expected '$($r.branch)'"
            } else {
                $f = Invoke-Git $path @('fetch', '--prune', '--quiet', 'origin')
                if ($f.Code -ne 0) {
                    $row.Pull = 'fetch FAILED'
                    Write-Host $f.Out
                } else {
                    $m = Invoke-Git $path @('merge', '--ff-only', '--quiet', "origin/$($r.branch)")
                    if ($m.Code -ne 0) { $row.Pull = 'NOT fast-forward (diverged), left alone'; Write-Host $m.Out }
                    else { $row.Pull = 'ok' }
                }
            }
        } elseif ($NoPull) { $row.Pull = 'skipped (-NoPull)' }
        $row.After = (Invoke-Git $path @('rev-parse', 'HEAD')).Out
        if ($row.Before -and $row.After -and $row.Before -ne $row.After) {
            $row.Commits = [int](Invoke-Git $path @('rev-list', '--count', "$($row.Before)..$($row.After)")).Out
        }
        Write-Host ("{0}: {1} -> {2} ({3} new commits) pull={4}" -f $r.name, $row.Before.Substring(0, [Math]::Min(12, $row.Before.Length)), $row.After.Substring(0, [Math]::Min(12, $row.After.Length)), $row.Commits, $row.Pull)

        # --- 2. security gate ---------------------------------------------------------
        $gate = Invoke-Scanner @('gate', '--root', $script:ArtcraftRoot, '--repo', $r.name)
        switch ($gate) {
            0       { $row.Gate = 'clean' }
            10      { $row.Gate = 'FLAGGED' }
            default { $row.Gate = "error ($gate)" }
        }
        $state = Get-Content -Raw (Join-Path $script:OpsDir 'state\scan-state.json') -ErrorAction SilentlyContinue | ConvertFrom-Json
        if ($state -and $state.repos.PSObject.Properties.Name -contains $r.name) {
            $rs = $state.repos.($r.name)
            if ($rs.PSObject.Properties.Name -contains 'last_report') { $row.Report = $rs.last_report }
            if ($row.Gate -eq 'FLAGGED' -and $rs.PSObject.Properties.Name -contains 'reason') { $row.Gate = "FLAGGED: $($rs.reason)" }
        }

        # --- 3. build ---------------------------------------------------------------------
        if ($NoBuild) { $row.Build = 'skipped (-NoBuild)' }
        elseif ($gate -ne 0) { $row.Build = 'blocked by gate' }
        elseif (-not $cargo) { $row.Build = 'skipped (no Rust toolchain)' }
        else {
            $should = Invoke-Scanner @('should-build', '--root', $script:ArtcraftRoot, '--repo', $r.name)
            if ($should -eq 1) { $row.Build = 'up to date' }
            elseif ($should -ne 0) { $row.Build = 'not approved' }
            else { $row.Build = Invoke-RepoBuild -Repo $r -Cargo $cargo -LogDir $logDir -Jobs $Jobs }
        }
        $results += [pscustomobject]$row
    }
} finally {
    Remove-Item $lock -ErrorAction SilentlyContinue
}

# --- summary -------------------------------------------------------------------------
$elapsed = [Math]::Round(((Get-Date) - $started).TotalMinutes, 1)
$md = @()
$md += "# ArtCraft nightly update: $stamp"
$md += ''
$md += "Finished $(Get-Date -Format 'yyyy-MM-dd HH:mm') in $elapsed min. Mode: $(if ($NoBuild) {'pull + scan only'} else {'pull + scan + build'})."
$md += ''
$md += '| Repo | Pull | New commits | Gate | Build | Scan report |'
$md += '|---|---|---|---|---|---|'
foreach ($x in $results) {
    $md += ('| {0} | {1} | {2} | {3} | {4} | {5} |' -f $x.Repo, $x.Pull, $x.Commits, $x.Gate, $x.Build, $(if ($x.Report) { '`' + $x.Report + '`' } else { '' }))
}
$md += ''
$md += 'What to do:'
$md += '- **FLAGGED**: open the scan report, read the blocking findings (each has file:line and evidence). If they are fine, run'
$md += '  `ops\scripts\windows\approve-repo.ps1 -Repo <name> -Note "why"` and then `build-approved.ps1 -Repos <name>`.'
$md += '  If something looks malicious, do not build. Keep the last good build and report it upstream.'
$md += '- **needs-baseline**: the repo has no approved commit yet (new clone). Either trust the published audit'
$md += '  (`ops\scripts\windows\adopt-audit-baseline.ps1`, see SECURITY-REPORT.md) or do a full review first (ops\security\SECURITY-SCAN-GUIDE.md).'
$md += "- Full log: ``$transcript``"
$text = $md -join "`r`n"
Set-Content -Path (Join-Path $repDir "nightly-$stamp.md") -Value $text -Encoding UTF8
Set-Content -Path (Join-Path $repDir 'LATEST.md') -Value $text -Encoding UTF8
Write-Host ''
Write-Host $text
try { Stop-Transcript | Out-Null } catch { }
