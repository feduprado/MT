$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$playersDir = Join-Path $root "Assets/Players"
$reservesDir = Join-Path $root "Assets/Reservas"
$updateScript = Join-Path $PSScriptRoot "UpdateRoster.ps1"

if (-not (Test-Path $updateScript)) {
  Write-Host "UpdateRoster.ps1 não encontrado: $updateScript"
  exit 1
}

$timer = New-Object System.Timers.Timer
$timer.Interval = 500
$timer.AutoReset = $false

Register-ObjectEvent -InputObject $timer -EventName Elapsed -Action {
  & $updateScript
} | Out-Null

$onChange = {
  $timer.Stop()
  $timer.Start()
}

$watchers = @()
foreach ($path in @($playersDir, $reservesDir)) {
  if (-not (Test-Path $path)) { continue }
  $watcher = New-Object System.IO.FileSystemWatcher
  $watcher.Path = $path
  $watcher.Filter = "*.png"
  $watcher.IncludeSubdirectories = $false
  $watcher.EnableRaisingEvents = $true

  Register-ObjectEvent -InputObject $watcher -EventName Created -Action $onChange | Out-Null
  Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $onChange | Out-Null
  Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $onChange | Out-Null
  Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $onChange | Out-Null

  $watchers += $watcher
}

Write-Host "Monitorando alterações em Assets/Players e Assets/Reservas..."
while ($true) {
  Start-Sleep -Seconds 1
}
