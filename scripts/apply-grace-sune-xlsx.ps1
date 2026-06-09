param(
  [string]$InputPath = "C:\Users\Redzin\Downloads\Grace Halliwell.xlsx",
  [string]$OutputPath = "D:\MesasFoundry\Data\Data\systems\world-behind-the-veil\Grace Halliwell - Sune leve.xlsx"
)

$ErrorActionPreference = "Stop"
$workspace = (Resolve-Path ".").Path
$tempRoot = Join-Path $workspace ".tmp"
$tempDir = Join-Path $tempRoot "grace-sune-xlsx"

if ((Test-Path -LiteralPath $tempDir)) {
  $resolvedTemp = (Resolve-Path -LiteralPath $tempDir).Path
  if (-not $resolvedTemp.StartsWith($workspace, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Temp path safety check failed: $resolvedTemp"
  }
  Remove-Item -LiteralPath $tempDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($InputPath, $tempDir)

$nsUri = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"

function New-WorkbookXmlDocument([string]$path) {
  $doc = New-Object System.Xml.XmlDocument
  $doc.PreserveWhitespace = $true
  $doc.Load($path)
  return $doc
}

function Save-XmlDocument($doc, [string]$path) {
  $settings = New-Object System.Xml.XmlWriterSettings
  $settings.Encoding = New-Object System.Text.UTF8Encoding($false)
  $settings.Indent = $false
  $writer = [System.Xml.XmlWriter]::Create($path, $settings)
  $doc.Save($writer)
  $writer.Close()
}

function Set-Attr($node, [string]$name, [string]$value) {
  $node.SetAttribute($name, $value)
}

function Add-Font($doc, $fonts, [string]$name, [string]$size, [string]$rgb, [bool]$bold = $false, [bool]$italic = $false) {
  $font = $doc.CreateElement("font", $nsUri)
  if ($bold) { [void]$font.AppendChild($doc.CreateElement("b", $nsUri)) }
  if ($italic) { [void]$font.AppendChild($doc.CreateElement("i", $nsUri)) }

  $sz = $doc.CreateElement("sz", $nsUri)
  Set-Attr $sz "val" $size
  [void]$font.AppendChild($sz)

  $color = $doc.CreateElement("color", $nsUri)
  Set-Attr $color "rgb" $rgb
  [void]$font.AppendChild($color)

  $fontName = $doc.CreateElement("name", $nsUri)
  Set-Attr $fontName "val" $name
  [void]$font.AppendChild($fontName)

  [void]$fonts.AppendChild($font)
  $fontId = [int]$fonts.GetAttribute("count")
  Set-Attr $fonts "count" ([string]($fontId + 1))
  return $fontId
}

function Add-Fill($doc, $fills, [string]$rgb) {
  $fill = $doc.CreateElement("fill", $nsUri)
  $pattern = $doc.CreateElement("patternFill", $nsUri)
  Set-Attr $pattern "patternType" "solid"

  $fg = $doc.CreateElement("fgColor", $nsUri)
  Set-Attr $fg "rgb" $rgb
  [void]$pattern.AppendChild($fg)

  $bg = $doc.CreateElement("bgColor", $nsUri)
  Set-Attr $bg "indexed" "64"
  [void]$pattern.AppendChild($bg)

  [void]$fill.AppendChild($pattern)
  [void]$fills.AppendChild($fill)

  $fillId = [int]$fills.GetAttribute("count")
  Set-Attr $fills "count" ([string]($fillId + 1))
  return $fillId
}

function Add-StyleFromBase($doc, $cellXfs, [int]$baseStyleId, [int]$fontId, [int]$fillId) {
  $base = $cellXfs.ChildNodes.Item($baseStyleId)
  if ($null -eq $base) {
    throw "Base style $baseStyleId not found."
  }

  $xf = $base.CloneNode($true)
  Set-Attr $xf "fontId" ([string]$fontId)
  Set-Attr $xf "fillId" ([string]$fillId)
  Set-Attr $xf "applyFont" "1"
  Set-Attr $xf "applyFill" "1"

  [void]$cellXfs.AppendChild($xf)
  $styleId = [int]$cellXfs.GetAttribute("count")
  Set-Attr $cellXfs "count" ([string]($styleId + 1))
  return $styleId
}

function Set-CellStyle($sheetDoc, $ns, [string]$cellRef, [int]$styleId) {
  $cell = $sheetDoc.SelectSingleNode("//m:c[@r='$cellRef']", $ns)
  if ($null -ne $cell) {
    Set-Attr $cell "s" ([string]$styleId)
  }
}

$stylesPath = Join-Path $tempDir "xl\styles.xml"
$stylesDoc = New-WorkbookXmlDocument $stylesPath
$stylesNs = New-Object System.Xml.XmlNamespaceManager($stylesDoc.NameTable)
$stylesNs.AddNamespace("m", $nsUri)

$fonts = $stylesDoc.SelectSingleNode("/m:styleSheet/m:fonts", $stylesNs)
$fills = $stylesDoc.SelectSingleNode("/m:styleSheet/m:fills", $stylesNs)
$cellXfs = $stylesDoc.SelectSingleNode("/m:styleSheet/m:cellXfs", $stylesNs)

$fontWine = Add-Font $stylesDoc $fonts "Georgia" "10" "FF7C2540" $true $false
$fontGoldTitle = Add-Font $stylesDoc $fonts "Grenze Gotisch" "31" "FF7C2540" $true $false
$fontName = Add-Font $stylesDoc $fonts "Inconsolata" "24" "FF7C2540" $false $false
$fontSoftLabel = Add-Font $stylesDoc $fonts "MedievalSharp" "10" "FFB34B6A" $true $false
$fontStory = Add-Font $stylesDoc $fonts "Inconsolata" "15" "FF4F2535" $false $false

$fillBlush = Add-Fill $stylesDoc $fills "FFFFF1F5"
$fillPearl = Add-Fill $stylesDoc $fills "FFFFFAF7"
$fillGoldSoft = Add-Fill $stylesDoc $fills "FFFFF2CC"
$fillRoseSoft = Add-Fill $stylesDoc $fills "FFFDE7EF"

$styleTitle = Add-StyleFromBase $stylesDoc $cellXfs 4 $fontGoldTitle $fillBlush
$styleName = Add-StyleFromBase $stylesDoc $cellXfs 25 $fontName $fillPearl
$styleClass = Add-StyleFromBase $stylesDoc $cellXfs 16 $fontWine $fillPearl
$styleCard = Add-StyleFromBase $stylesDoc $cellXfs 84 $fontWine $fillRoseSoft
$styleCard2 = Add-StyleFromBase $stylesDoc $cellXfs 109 $fontWine $fillRoseSoft
$styleLabel = Add-StyleFromBase $stylesDoc $cellXfs 204 $fontSoftLabel $fillGoldSoft
$styleLife = Add-StyleFromBase $stylesDoc $cellXfs 151 $fontSoftLabel $fillGoldSoft
$styleStat = Add-StyleFromBase $stylesDoc $cellXfs 89 $fontSoftLabel $fillPearl
$styleStoryHeading = Add-StyleFromBase $stylesDoc $cellXfs 411 $fontSoftLabel $fillGoldSoft
$styleStoryBody = Add-StyleFromBase $stylesDoc $cellXfs 412 $fontStory $fillPearl

Save-XmlDocument $stylesDoc $stylesPath

$sheetPath = Join-Path $tempDir "xl\worksheets\sheet1.xml"
$sheetDoc = New-WorkbookXmlDocument $sheetPath
$sheetNs = New-Object System.Xml.XmlNamespaceManager($sheetDoc.NameTable)
$sheetNs.AddNamespace("m", $nsUri)

$worksheet = $sheetDoc.DocumentElement
$sheetPr = $sheetDoc.SelectSingleNode("/m:worksheet/m:sheetPr", $sheetNs)
if ($null -eq $sheetPr) {
  $sheetPr = $sheetDoc.CreateElement("sheetPr", $nsUri)
  [void]$worksheet.InsertBefore($sheetPr, $worksheet.FirstChild)
}
$tabColor = $sheetPr.SelectSingleNode("m:tabColor", $sheetNs)
if ($null -eq $tabColor) {
  $tabColor = $sheetDoc.CreateElement("tabColor", $nsUri)
  [void]$sheetPr.AppendChild($tabColor)
}
Set-Attr $tabColor "rgb" "FFF6B6C8"

$styleMap = @{
  "D2" = $styleTitle
  "D5" = $styleName
  "U4" = $styleClass
  "AE11" = $styleCard
  "AE14" = $styleCard2
  "S19" = $styleLife
  "S23" = $styleLife
  "T28" = $styleLabel
  "AE29" = $styleLabel
  "S57" = $styleLabel
  "AA89" = $styleLabel
  "L140" = $styleStoryHeading
  "B141" = $styleStoryBody
}

foreach ($ref in @("D12", "D17", "D22", "D27", "D32", "D37")) {
  $styleMap[$ref] = $styleStat
}

foreach ($entry in $styleMap.GetEnumerator()) {
  Set-CellStyle $sheetDoc $sheetNs $entry.Key $entry.Value
}

Save-XmlDocument $sheetDoc $sheetPath

if (Test-Path -LiteralPath $OutputPath) {
  Remove-Item -LiteralPath $OutputPath -Force
}

$zip = [System.IO.Compression.ZipFile]::Open($OutputPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -LiteralPath $tempDir -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($tempDir.Length).TrimStart('\', '/')
    $entryName = $relative -replace '\\', '/'
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName)
  }
} finally {
  $zip.Dispose()
}

Write-Output "Created: $OutputPath"
