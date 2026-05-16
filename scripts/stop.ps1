$ErrorActionPreference = "Stop"

function Get-ChildProcessIdsRecursive {
  param([int]$RootPid)

  $result = New-Object System.Collections.Generic.List[int]
  $queue = New-Object System.Collections.Generic.Queue[int]
  $queue.Enqueue($RootPid)

  while ($queue.Count -gt 0) {
    $current = $queue.Dequeue()
    $children = Get-CimInstance Win32_Process -Filter "ParentProcessId = $current" -ErrorAction SilentlyContinue
    foreach ($child in $children) {
      $childId = [int]$child.ProcessId
      if (-not $result.Contains($childId)) {
        $result.Add($childId)
        $queue.Enqueue($childId)
      }
    }
  }

  return $result
}

function Stop-ProcessTree {
  param(
    [int]$RootPid,
    [string]$Name
  )

  if ($RootPid -le 0) {
    return
  }

  $allPids = @()

  if ($env:OS -eq "Windows_NT") {
    $children = Get-ChildProcessIdsRecursive -RootPid $RootPid
    $allPids = $children + @($RootPid)
  }
  else {
    $allPids = @($RootPid)
  }

  foreach ($procId in ($allPids | Sort-Object -Descending | Get-Unique)) {
    try {
      Stop-Process -Id $procId -Force -ErrorAction Stop
      Write-Host "Stopped $Name process (PID $procId)" -ForegroundColor Green
    }
    catch {
      Write-Host "$Name process (PID $procId) already stopped." -ForegroundColor DarkGray
    }
  }
}

$root = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $root ".dev-pids.json"

if (-not (Test-Path $pidFile)) {
  Write-Host "No running process metadata found (.dev-pids.json)." -ForegroundColor Yellow
  exit 0
}

$state = Get-Content $pidFile -Raw | ConvertFrom-Json

Stop-ProcessTree -RootPid ([int]$state.serverPid) -Name "server"
Stop-ProcessTree -RootPid ([int]$state.clientPid) -Name "client"

Remove-Item -Path $pidFile -Force -ErrorAction SilentlyContinue
Write-Host "ExoFlowers stopped." -ForegroundColor Green

