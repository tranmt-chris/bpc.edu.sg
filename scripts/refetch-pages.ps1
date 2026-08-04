$ErrorActionPreference = 'Stop'
$pages = @(
  'index.html','about.html','alumni.html','ba.html','bc.html','books.html','contact.html',
  'courses.html','dip.html','dipc.html','elibrary.html','gallery.html','intro.html',
  'introc.html','key.html','ma.html','team.html','teamac.html','teamnac.html','teamvisit.html','visit.html'
)
$publicRoot = Join-Path $PSScriptRoot '..\public'
foreach ($page in $pages) {
  Invoke-WebRequest -UseBasicParsing -Uri ('https://www.bpc.edu.sg/' + $page) -OutFile (Join-Path $publicRoot $page)
}
