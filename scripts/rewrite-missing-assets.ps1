$publicRoot = Join-Path $PSScriptRoot '..\public'
$baseUrl = 'https://www.bpc.edu.sg/'

foreach ($file in Get-ChildItem $publicRoot -Filter '*.html') {
    $html = Get-Content -Raw $file.FullName
    $updated = [regex]::Replace($html, '(?i)(?<attribute>href|src)\s*=\s*(?<quote>["''])(?<value>[^"''#?]+)\k<quote>', {
        param($match)
        $value = $match.Groups['value'].Value
        if ($value -match '^(?:https?:|mailto:|tel:|javascript:|//)' -or $value -match '(?i)\.html$') { return $match.Value }
        $localPath = Join-Path $publicRoot ($value.TrimStart('/') -replace '/', '\')
        if (Test-Path $localPath) { return $match.Value }
        $absolute = $baseUrl + $value.TrimStart('/')
        return $match.Groups['attribute'].Value + '=' + $match.Groups['quote'].Value + $absolute + $match.Groups['quote'].Value
    })
    if ($updated -ne $html) { Set-Content -Path $file.FullName -Value $updated -Encoding utf8 }
}
