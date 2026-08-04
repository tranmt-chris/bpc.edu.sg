$ErrorActionPreference = 'Stop'

$baseUri = [Uri]'https://www.bpc.edu.sg/'
$publicRoot = Join-Path $PSScriptRoot '..\public'
$queue = [System.Collections.Generic.Queue[string]]::new()
$seen = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
$assets = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

$queue.Enqueue('index.html')

function Save-RemoteFile([string]$relativePath) {
    $cleanPath = $relativePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($cleanPath)) { $cleanPath = 'index.html' }
    $targetPath = Join-Path $publicRoot ($cleanPath -replace '/', '\')
    $targetDirectory = Split-Path $targetPath -Parent
    New-Item -ItemType Directory -Force -Path $targetDirectory | Out-Null
    Invoke-WebRequest -Uri ([Uri]::new($baseUri, $cleanPath)) -OutFile $targetPath -UseBasicParsing
    return $targetPath
}

while ($queue.Count -gt 0) {
    $page = $queue.Dequeue()
    if (-not $seen.Add($page)) { continue }
    try {
        $savedPage = Save-RemoteFile $page
        $html = Get-Content -Raw $savedPage
    } catch {
        Write-Warning "Skipped $page"
        continue
    }

    foreach ($match in [regex]::Matches($html, '(?i)(?:href|src)\s*=\s*["'']([^"''#?]+)')) {
        $reference = $match.Groups[1].Value.Trim()
        if ($reference -match '^(?:https?:|mailto:|tel:|javascript:|//)') { continue }
        $resolved = [Uri]::new([Uri]::new($baseUri, $page), $reference)
        if ($resolved.Host -ne $baseUri.Host) { continue }
        $path = [Uri]::UnescapeDataString($resolved.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
        if ($path -match '(?i)\.html$') { $queue.Enqueue($path) } else { [void]$assets.Add($path) }
    }
}

foreach ($asset in $assets) {
    try { [void](Save-RemoteFile $asset) } catch { Write-Warning "Skipped asset $asset" }
}

$cssFiles = Get-ChildItem (Join-Path $publicRoot 'css') -Filter '*.css' -ErrorAction SilentlyContinue
foreach ($cssFile in $cssFiles) {
    $css = Get-Content -Raw $cssFile.FullName
    foreach ($match in [regex]::Matches($css, '(?i)url\((?:["'']?)([^)"'']+)')) {
        $reference = $match.Groups[1].Value.Trim()
        if ($reference -match '^(?:data:|https?:|//)') { continue }
        $resolved = [Uri]::new([Uri]::new($baseUri, 'css/' + $cssFile.Name), $reference)
        $path = [Uri]::UnescapeDataString($resolved.AbsolutePath.TrimStart('/'))
        try { [void](Save-RemoteFile $path) } catch { Write-Warning "Skipped CSS asset $path" }
    }
}

Write-Output "Mirrored $($seen.Count) pages and $($assets.Count) directly referenced assets."
