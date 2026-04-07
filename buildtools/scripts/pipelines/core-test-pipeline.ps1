Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-PipelineLog {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Message
  )

  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Write-Host "[$stamp] $Message"
}

function New-ArtifactFolder {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  if (-not (Test-Path $Path)) {
    New-Item -Path $Path -ItemType Directory -Force | Out-Null
  }
}

if (-not $env:REPO_ROOT) {
    $env:REPO_ROOT = (Resolve-Path "$PSScriptRoot\..\..\..").Path
}

$resultsRoot = "$env:REPO_ROOT\core-test-results"
$coverageRoot = "$env:REPO_ROOT\coverage"
$artifactsRoot = "$env:REPO_ROOT\artifacts\tests"

New-ArtifactFolder -Path $resultsRoot
New-ArtifactFolder -Path $coverageRoot
New-ArtifactFolder -Path $artifactsRoot

Get-ChildItem -Path $resultsRoot -Force | Remove-Item -Recurse -Force
Get-ChildItem -Path $coverageRoot -Force | Remove-Item -Recurse -Force
Get-ChildItem -Path $artifactsRoot -Force | Remove-Item -Recurse -Force

Write-PipelineLog "Installing dependencies and building app"
$buildExit = 0
Push-Location "$env:REPO_ROOT"
try {
  npm install
  if ($LASTEXITCODE -ne 0) { $buildExit = $LASTEXITCODE }

  if ($buildExit -eq 0) {
    npm run build
    if ($LASTEXITCODE -ne 0) { $buildExit = $LASTEXITCODE }
  }
}
finally {
  Pop-Location
}

Write-PipelineLog "Running tests"
$clientExit = 0
Push-Location "$env:REPO_ROOT"
try {
  if ($buildExit -eq 0) {
    npx vitest run `
      --reporter=default `
      --reporter=junit `
      --outputFile.junit="$resultsRoot\junit.xml" `
      --coverage.enabled=true `
      --coverage.provider=v8 `
      --coverage.reporter=html `
      --coverage.reporter=cobertura `
      --coverage.reporter=text-summary `
      --coverage.reportsDirectory="$coverageRoot"

    if ($LASTEXITCODE -ne 0) { $clientExit = $LASTEXITCODE }
  }
}
finally {
    Pop-Location
}

Copy-Item "$resultsRoot\*" "$artifactsRoot" -Force
Copy-Item "$coverageRoot\*" "$artifactsRoot" -Force

Compress-Archive -Path "$coverageRoot\*" -DestinationPath "$env:REPO_ROOT\coverage.zip" -Force
Compress-Archive -Path "$resultsRoot\*" -DestinationPath "$env:REPO_ROOT\test-results.zip" -Force

Write-PipelineLog "Test and packaging pipeline completed"

if ($buildExit -ne 0 -or $clientExit -ne 0) {
  throw "Pipeline failed. buildExit=$buildExit clientExit=$clientExit"
}
