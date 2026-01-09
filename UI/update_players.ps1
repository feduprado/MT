
$root = Split-Path -Parent $PSScriptRoot
$updateScript = Join-Path $root "Tools/UpdateRoster.ps1"

if (-not (Test-Path $updateScript)) {
  Write-Host "UpdateRoster.ps1 não encontrado: $updateScript"
  exit 1
}

& $updateScript
