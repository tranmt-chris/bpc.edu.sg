$publicRoot = Join-Path $PSScriptRoot '..\public'

foreach ($file in Get-ChildItem $publicRoot -Filter '*.html') {
    $html = Get-Content -Raw $file.FullName
    if ($html -notmatch 'css/revamp.css') {
        $html = $html -replace '</head>', "`t<link rel=`"stylesheet`" href=`"css/revamp.css`">`r`n</head>"
    }
    if ($html -notmatch 'js/revamp.js') {
        $html = $html -replace '</body>', "`t<script src=`"js/revamp.js`"></script>`r`n</body>"
    }
    Set-Content -Path $file.FullName -Value $html -Encoding utf8
}
