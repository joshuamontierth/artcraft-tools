<#
.SYNOPSIS
  Register the built ArtCraft apps as MCP servers in Claude Code (user scope, so they work from any folder).

.DESCRIPTION
  For each built app it registers:
    <app>            the live bridge to the running app (start the app first with its "(ArtCraft)" shortcut),
                     or the headless server for apps without a live mode (PdfCraft)
    <app>-headless   a windowless server working on files in %USERPROFILE%\ArtCraft\<App>
                     (by default only for the course apps; use -IncludeHeadless for all)
  Existing registrations with the same names are replaced. Check them in Claude Code with /mcp.

  Never approve the project-level .mcp.json files inside the repos when Claude Code offers them.
  Some run `cargo run`, which would build and execute whatever is checked out.

.EXAMPLE
  .\register-mcp.ps1                       # all built apps
  .\register-mcp.ps1 -Repos photocraft -WhatIf
  .\register-mcp.ps1 -Unregister
#>
[CmdletBinding()]
param([string[]]$Repos, [switch]$IncludeHeadless, [switch]$Unregister, [switch]$WhatIf)

. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')
$claude = (Get-Command claude -ErrorAction SilentlyContinue).Source
if (-not $claude -and -not $WhatIf) { Write-Host 'The claude CLI was not found on PATH.' -ForegroundColor Red; exit 2 }

function Set-Mcp([string]$Name, [string]$Exe, [string[]]$McpArgs) {
    $shown = ($McpArgs | ForEach-Object { if ($_ -match '\s') { '"' + $_ + '"' } else { $_ } }) -join ' '
    Write-Host "claude mcp add --scope user $Name -- `"$Exe`" $shown"
    if ($WhatIf) { return }
    & $claude mcp remove --scope user $Name 2>&1 | Out-Null
    & $claude mcp add --scope user $Name -- $Exe @McpArgs
}

foreach ($r in (Get-ArtcraftRepos -Only $Repos)) {
    $names = @($r.name, "$($r.name)-headless")
    if ($Unregister) {
        foreach ($n in $names) { Write-Host "claude mcp remove --scope user $n"; if (-not $WhatIf) { & $claude mcp remove --scope user $n 2>&1 | Out-Null } }
        continue
    }
    $cli = Get-ExePath $r 'cli'
    if (-not (Test-Path $cli)) { Write-Host "skip $($r.name): $cli not built" -ForegroundColor DarkGray; continue }
    $work = Get-WorkDir $r
    New-Item -ItemType Directory -Force -Path $work | Out-Null
    if ($r.mcp_live_args) {
        if ($r.token_file) { Initialize-PrivateDir (Split-Path (Get-TokenFile $r)) }
        Set-Mcp $r.name $cli (Expand-RepoArgs $r $r.mcp_live_args)
        if ($IncludeHeadless -or $r.course) { Set-Mcp "$($r.name)-headless" $cli (Expand-RepoArgs $r $r.mcp_headless_args) }
    } else {
        Set-Mcp $r.name $cli (Expand-RepoArgs $r $r.mcp_headless_args)
    }
}
if (-not $WhatIf -and -not $Unregister) {
    Write-Host ''
    Write-Host 'Done. Start an app with its "(ArtCraft)" shortcut, then in a terminal:  cd $env:USERPROFILE\ArtCraft\<App>; claude   and type /mcp'
}
