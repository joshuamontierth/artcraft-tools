<#
.SYNOPSIS
  Download the public-domain / CC0 practice files for the ArtCraft courses.

.DESCRIPTION
  Reads courses\assets\manifest.js, downloads each file into courses\assets\<app>\ (skipping files you
  already have), creates the derived practice files (a tilted copy for straightening, sample captions),
  and copies everything into %USERPROFILE%\ArtCraft\<App>\practice\ where the apps and Claude can reach it.
  Sources: Wikimedia Commons (public-domain art and NASA photos), raw.pixls.us (CC0 raw files), NASA video,
  and Musopen/archive.org (public-domain music). About 350 MB in total.

.PARAMETER Course  Only fetch for these courses (photocraft, lightcraft, filmcraft).
.PARAMETER Force   Re-download files that already exist.
#>
[CmdletBinding()]
param([string[]]$Course, [switch]$Force)

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { }
. (Join-Path $PSScriptRoot 'ArtcraftCommon.ps1')
if ($Course) { $Course = Split-NameList $Course }

$coursesDir = Join-Path $script:ArtcraftRoot 'courses'
$manifestJs = Get-Content -Raw (Join-Path $coursesDir 'assets\manifest.js')
$json = $manifestJs.Substring($manifestJs.IndexOf('{'), $manifestJs.LastIndexOf('}') - $manifestJs.IndexOf('{') + 1)
$manifest = $json | ConvertFrom-Json
$titles = @{}; foreach ($r in (Get-ArtcraftConfig)) { $titles[$r.name] = $r.title }
$ua = 'ArtCraftCourseFetcher/1.0 (personal course practice files)'
$curl = (Get-Command curl.exe -ErrorAction SilentlyContinue).Source

function Get-File([string]$Url, [string]$Dest) {
    $tmp = "$Dest.part"
    for ($i = 1; $i -le 3; $i++) {
        if ($curl) { & $curl -fsSL --retry 2 -A $ua -o $tmp $Url; $ok = ($LASTEXITCODE -eq 0) }
        else { try { Invoke-WebRequest -Uri $Url -OutFile $tmp -UserAgent $ua -UseBasicParsing; $ok = $true } catch { $ok = $false } }
        if ($ok -and (Test-Path $tmp) -and (Get-Item $tmp).Length -gt 0) { Move-Item -Force $tmp $Dest; return $true }
        Start-Sleep -Seconds (3 * $i)
    }
    Remove-Item $tmp -ErrorAction SilentlyContinue
    return $false
}

function New-TiltedCopy([string]$Src, [string]$Dest, [double]$Degrees, [bool]$Warm) {
    Add-Type -AssemblyName System.Drawing
    $img = [System.Drawing.Image]::FromFile($Src)
    try {
        $w = $img.Width; $h = $img.Height
        $bmp = New-Object System.Drawing.Bitmap $w, $h
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $rad = [Math]::Abs($Degrees) * [Math]::PI / 180
        $scale = [Math]::Cos($rad) + [Math]::Sin($rad) * [Math]::Max($w / $h, $h / $w)   # enlarge so no empty corners
        $g.TranslateTransform($w / 2, $h / 2)
        $g.RotateTransform($Degrees)
        $g.ScaleTransform($scale, $scale)
        $attr = New-Object System.Drawing.Imaging.ImageAttributes
        if ($Warm) {
            $m = New-Object System.Drawing.Imaging.ColorMatrix
            $m.Matrix00 = 1.08; $m.Matrix11 = 1.0; $m.Matrix22 = 0.88; $m.Matrix33 = 1.0; $m.Matrix44 = 1.0
            $attr.SetColorMatrix($m)
        }
        $rect = New-Object System.Drawing.Rectangle ([int](-$w / 2)), ([int](-$h / 2)), $w, $h
        $g.DrawImage($img, $rect, 0, 0, $w, $h, [System.Drawing.GraphicsUnit]::Pixel, $attr)
        $g.Dispose()
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
        $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]92)
        $bmp.Save($Dest, $codec, $ep)
        $bmp.Dispose()
    } finally { $img.Dispose() }
}

$srt = @"
1
00:00:01,000 --> 00:00:04,000
This is our planet, seen from orbit.

2
00:00:04,500 --> 00:00:08,000
Every swirl of cloud is a weather system.

3
00:00:08,500 --> 00:00:12,000
Coastlines glow at the edge of night.

4
00:00:12,500 --> 00:00:16,000
City lights trace where people live.

5
00:00:16,500 --> 00:00:20,000
The atmosphere is a thin blue line.

6
00:00:20,500 --> 00:00:24,000
From up here, there are no borders.

7
00:00:24,500 --> 00:00:28,000
Just one world, turning slowly.

8
00:00:28,500 --> 00:00:30,000
Earth views, courtesy of NASA.
"@

$results = @()
$entries = @($manifest.files | Where-Object { -not $Course -or $Course -contains $_.course })
# Plain downloads first, then derived/generated files (they may depend on downloads).
$ordered = @($entries | Where-Object { $_.PSObject.Properties.Name -contains 'url' }) + @($entries | Where-Object { $_.PSObject.Properties.Name -notcontains 'url' })
foreach ($e in $ordered) {
    $dest = Join-Path $coursesDir ($e.file -replace '/', '\')
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    $have = (Test-Path $dest) -and ((Get-Item $dest).Length -gt 0)
    $status = ''
    if ($e.PSObject.Properties.Name -contains 'manual') {
        $status = 'MANUAL: ' + $e.manual
    } elseif ($have -and -not $Force) {
        $status = 'already present'
    } elseif ($e.PSObject.Properties.Name -contains 'url') {
        Write-Host "downloading $($e.file) ..."
        $status = if (Get-File $e.url $dest) { 'downloaded' } else { 'FAILED: ' + $e.url }
    } elseif ($e.PSObject.Properties.Name -contains 'derive') {
        # Locate the source, falling back to the source's original URL if it hasn't been downloaded.
        $src = Join-Path $coursesDir ($e.derive.from -replace '/', '\')
        if (-not (Test-Path $src)) {
            $srcEntry = $manifest.files | Where-Object { $_.file -eq $e.derive.from } | Select-Object -First 1
            if ($srcEntry) { New-Item -ItemType Directory -Force -Path (Split-Path $src) | Out-Null; [void](Get-File $srcEntry.url $src) }
        }
        if (Test-Path $src) {
            try { New-TiltedCopy $src $dest ([double]$e.derive.rotate) ([bool]$e.derive.warm); $status = 'created (derived)' }
            catch { Copy-Item $src $dest -Force; $status = 'copied without tilt (System.Drawing failed: ' + $_.Exception.Message + ')' }
        } else { $status = 'FAILED: source missing' }
    } elseif ($e.PSObject.Properties.Name -contains 'generate') {
        Set-Content -Path $dest -Value $srt -Encoding UTF8
        $status = 'generated'
    }
    # Copy into the app's practice folder.
    if ((Test-Path $dest) -and $titles.ContainsKey($e.course)) {
        $practice = Join-Path $env:USERPROFILE ("ArtCraft\{0}\practice" -f $titles[$e.course])
        New-Item -ItemType Directory -Force -Path $practice | Out-Null
        Copy-Item $dest (Join-Path $practice (Split-Path $dest -Leaf)) -Force
    }
    $results += [pscustomobject]@{ Course = $e.course; File = $e.file; Status = $status }
}
$results | Format-Table -AutoSize | Out-String -Width 220 | Write-Host
$failed = @($results | Where-Object { $_.Status -like 'FAILED*' }).Count
Write-Host ("Done. {0} failed. Practice folders: {1}\ArtCraft\<App>\practice" -f $failed, $env:USERPROFILE)
Write-Host 'Credits and licenses: courses\assets\manifest.js (also shown in each lesson).'
