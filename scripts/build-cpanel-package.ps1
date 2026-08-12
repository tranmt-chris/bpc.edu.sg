param(
    [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\output")
)

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$publicRoot = Join-Path $projectRoot "public"
$outputRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
$dateStamp = Get-Date -Format "yyyy-MM-dd"
$stageRoot = Join-Path $outputRoot "bpc-cpanel-clean-$dateStamp"
$zipPath = Join-Path $outputRoot "BPC-cPanel-deployment-$dateStamp.zip"

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null

if (Test-Path $stageRoot) {
    $resolvedStage = (Resolve-Path $stageRoot).Path
    if (-not $resolvedStage.StartsWith($outputRoot + [System.IO.Path]::DirectorySeparatorChar)) {
        throw "Refusing to clean an unexpected staging path."
    }
    Remove-Item -LiteralPath $resolvedStage -Recurse -Force
}

New-Item -ItemType Directory -Path $stageRoot -Force | Out-Null
Copy-Item -Path (Join-Path $publicRoot "*") -Destination $stageRoot -Recurse -Force

# Source data and unused starter assets are not required by cPanel at runtime.
foreach ($relativePath in @("content", "file.svg", "globe.svg", "window.svg", "favicon.svg")) {
    $target = Join-Path $stageRoot $relativePath
    if (Test-Path $target) {
        Remove-Item -LiteralPath $target -Recurse -Force
    }
}

# Keep only PDFs that are still referenced by runtime HTML, CSS or JavaScript.
$markup = (Get-ChildItem $stageRoot -Recurse -File |
    Where-Object { $_.Extension -in ".html", ".css", ".js" } |
    ForEach-Object { Get-Content $_.FullName -Raw }) -join "`n"

$bulletinDirectory = Join-Path $stageRoot "ebulletin"
if (Test-Path $bulletinDirectory) {
    Get-ChildItem $bulletinDirectory -Filter *.pdf -File | ForEach-Object {
        $relativeUrl = "ebulletin/" + $_.Name
        if (-not $markup.Contains($relativeUrl)) {
            Remove-Item -LiteralPath $_.FullName -Force
        }
    }

    if (-not (Get-ChildItem $bulletinDirectory -Force)) {
        Remove-Item -LiteralPath $bulletinDirectory -Force
    }
}

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $stageRoot "*") -DestinationPath $zipPath -CompressionLevel Optimal

Write-Output $zipPath
