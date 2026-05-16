$ErrorActionPreference = "Stop"

function Test-ProcessAlive {
  param([int]$Id)

  if ($Id -le 0) {
    return $false
  }

  try {
    $null = Get-Process -Id $Id -ErrorAction Stop
    return $true
  }
  catch {
    return $false
  }
}

function Quote-ForCmd {
  param([string]$Text)

  return '"' + $Text.Replace('"', '""') + '"'
}

function Quote-ForSh {
  param([string]$Text)

  return "'" + $Text.Replace("'", "'\\''") + "'"
}

function Stop-ListenerOnPortWindows {
  param([int]$Port)

  $lines = netstat -ano | Select-String ":$Port\s"
  foreach ($line in $lines) {
    $parts = ($line.ToString() -split "\s+") | Where-Object { $_ -ne "" }
    if ($parts.Length -lt 5) { continue }

    $state = $parts[3]
    $procId = [int]$parts[4]

    if ($procId -le 0) { continue }
    if ($state -ne "LISTENING") { continue }

    try {
      Stop-Process -Id $procId -Force -ErrorAction Stop
      Write-Host "Freed port $Port by stopping PID $procId" -ForegroundColor DarkYellow
    }
    catch {
      Write-Host "Could not stop PID $procId on port $Port" -ForegroundColor DarkGray
    }
  }
}

$root = Split-Path -Parent $PSScriptRoot
$clientPath = Join-Path $root "exoflowers-client"
$serverPath = Join-Path $root "exoflowers-server"
$logsPath = Join-Path $root "logs"
$pidFile = Join-Path $root ".dev-pids.json"

& (Join-Path $PSScriptRoot "setup.ps1")

if (-not (Test-Path $logsPath)) {
  New-Item -ItemType Directory -Path $logsPath | Out-Null
}

if (Test-Path $pidFile) {
  $existing = Get-Content $pidFile -Raw | ConvertFrom-Json
  if ((Test-ProcessAlive -Id ([int]$existing.serverPid)) -or (Test-ProcessAlive -Id ([int]$existing.clientPid))) {
    Write-Host "Project seems to be already running." -ForegroundColor Yellow
    Write-Host "Use ./scripts/stop.ps1 first if you want a clean restart." -ForegroundColor Yellow
    exit 0
  }

  Remove-Item -Path $pidFile -Force -ErrorAction SilentlyContinue
}

if ($env:OS -eq "Windows_NT") {
  Stop-ListenerOnPortWindows -Port 5000
  Stop-ListenerOnPortWindows -Port 5173
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$serverOut = Join-Path $logsPath "server-$stamp.out.log"
$serverErr = Join-Path $logsPath "server-$stamp.err.log"
$clientOut = Join-Path $logsPath "client-$stamp.out.log"
$clientErr = Join-Path $logsPath "client-$stamp.err.log"

if ($env:OS -eq "Windows_NT") {
  $serverCommand = "npm run dev 1>> $(Quote-ForCmd $serverOut) 2>> $(Quote-ForCmd $serverErr)"
  $clientCommand = "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort 1>> $(Quote-ForCmd $clientOut) 2>> $(Quote-ForCmd $clientErr)"

  $serverProc = Start-Process -FilePath $env:ComSpec -ArgumentList "/c", $serverCommand -WorkingDirectory $serverPath -PassThru -WindowStyle Hidden
  $clientProc = Start-Process -FilePath $env:ComSpec -ArgumentList "/c", $clientCommand -WorkingDirectory $clientPath -PassThru -WindowStyle Hidden
}
else {
  $serverCommand = "npm run dev 1>> $(Quote-ForSh $serverOut) 2>> $(Quote-ForSh $serverErr)"
  $clientCommand = "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort 1>> $(Quote-ForSh $clientOut) 2>> $(Quote-ForSh $clientErr)"

  $serverProc = Start-Process -FilePath "/bin/sh" -ArgumentList "-lc", $serverCommand -WorkingDirectory $serverPath -PassThru
  $clientProc = Start-Process -FilePath "/bin/sh" -ArgumentList "-lc", $clientCommand -WorkingDirectory $clientPath -PassThru
}

Start-Sleep -Seconds 3

if (-not (Test-ProcessAlive -Id $serverProc.Id)) {
  Write-Host "Server failed to start. Check logs:" -ForegroundColor Red
  Write-Host "  $serverOut"
  Write-Host "  $serverErr"
  throw "Server startup failed"
}

if (-not (Test-ProcessAlive -Id $clientProc.Id)) {
  Write-Host "Client failed to start. Check logs:" -ForegroundColor Red
  Write-Host "  $clientOut"
  Write-Host "  $clientErr"
  throw "Client startup failed"
}

[pscustomobject]@{
  serverPid = $serverProc.Id
  clientPid = $clientProc.Id
  startedAt = (Get-Date).ToString("o")
  serverOut = $serverOut
  serverErr = $serverErr
  clientOut = $clientOut
  clientErr = $clientErr
} | ConvertTo-Json | Set-Content -Encoding UTF8 $pidFile

Write-Host "ExoFlowers started." -ForegroundColor Green
Write-Host "Client: http://127.0.0.1:5173"
Write-Host "Server: http://127.0.0.1:5000"
Write-Host ""
Write-Host "Logs:"
Write-Host "  $clientOut"
Write-Host "  $clientErr"
Write-Host "  $serverOut"
Write-Host "  $serverErr"
Write-Host ""
Write-Host "Stop command: ./scripts/stop.ps1" -ForegroundColor Cyan

