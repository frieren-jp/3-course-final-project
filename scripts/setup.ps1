param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Ensure-NpmDependencies {
  param(
    [string]$ProjectPath
  )

  $nodeModulesPath = Join-Path $ProjectPath "node_modules"

  if ($Force -or -not (Test-Path $nodeModulesPath)) {
    Write-Host "Installing dependencies in $ProjectPath ..." -ForegroundColor Cyan
    Push-Location $ProjectPath
    try {
      npm install
    }
    finally {
      Pop-Location
    }
  }
  else {
    Write-Host "Dependencies already installed in $ProjectPath" -ForegroundColor DarkGray
  }
}

$root = Split-Path -Parent $PSScriptRoot
$clientPath = Join-Path $root "exoflowers-client"
$serverPath = Join-Path $root "exoflowers-server"

if (-not (Test-Path $clientPath)) {
  throw "Client path not found: $clientPath"
}

if (-not (Test-Path $serverPath)) {
  throw "Server path not found: $serverPath"
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not installed or not available in PATH."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm is not installed or not available in PATH."
}

Ensure-NpmDependencies -ProjectPath $serverPath
Ensure-NpmDependencies -ProjectPath $clientPath

Write-Host "Setup completed." -ForegroundColor Green
