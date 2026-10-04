# 讲义/练习册 HTML → PDF 生成脚本（M1 固化：无页眉页脚，防本机路径泄露）
# 用法: powershell -File gen_pdf.ps1 -Html <html绝对路径> -OutPdf <pdf绝对路径>
# 依赖: Edge（默认路径 C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe）
# 注意: 必须用 --headless=new --no-pdf-header-footer；旧参数 --print-to-pdf-no-header 在 Edge 新版无效（实测）

param(
  [Parameter(Mandatory=$true)][string]$Html,
  [Parameter(Mandatory=$true)][string]$OutPdf
)

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) {
  $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}
$prof = Join-Path $env:TEMP ("edge_pdf_prof_" + [guid]::NewGuid().ToString("N"))
if (Test-Path $prof) { Remove-Item -Recurse -Force $prof }

& $edge --headless=new --disable-gpu --no-first-run --no-pdf-header-footer `
  "--user-data-dir=$prof" `
  --print-to-pdf="$OutPdf" ("file:///" + ($Html -replace '\\','/')) 2>&1 | Out-Null

Start-Sleep -Seconds 4
Remove-Item -Recurse -Force $prof -ErrorAction SilentlyContinue

if (-not (Test-Path $OutPdf)) { Write-Error "PDF 生成失败: $OutPdf"; exit 1 }
$f = Get-Item $OutPdf
if ($f.Length -lt 10000) { Write-Error "PDF 过小($($f.Length)B)，疑似渲染失败: $OutPdf"; exit 1 }
Write-Output "OK: $OutPdf ($($f.Length) bytes)"
