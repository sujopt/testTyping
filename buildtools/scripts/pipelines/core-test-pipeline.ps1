Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. "$PSScriptRoot\helpers.ps1"

if (-not $env:REPO_ROOT) {
    $env:REPO_ROOT = (Resolve-Path "$PSScriptRoot\..\..\..").Path
}

$resultsRoot = "$env:REPO_ROOT\core-test-results"
$coverageRoot = "$env:REPO_ROOT\coverage"
$artifactsRoot = "$env:REPO_ROOT\artifacts\tests"

New-ArtifactFolder -Path $resultsRoot
New-ArtifactFolder -Path $coverageRoot
New-ArtifactFolder -Path $artifactsRoot

Write-PipelineLog "Running client tests"
$clientExit = 0
Push-Location "$env:REPO_ROOT\client"
try {
    npm test
    if ($LASTEXITCODE -ne 0) { $clientExit = $LASTEXITCODE }
}
finally {
    Pop-Location
}

$serverExit = 0
if ($env:RUN_SERVER_TESTS -eq "true") {
    Write-PipelineLog "Running server tests"
    Push-Location "$env:REPO_ROOT\server"
    try {
        npm install
        npm test
        if ($LASTEXITCODE -ne 0) { $serverExit = $LASTEXITCODE }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-PipelineLog "Skipping server tests because RUN_SERVER_TESTS=$env:RUN_SERVER_TESTS"
}

# Minimal files to demonstrate trx/xml/coverage packaging in artifacts.
@"
<?xml version="1.0" encoding="utf-8"?>
<TestRun id="$env:GITHUB_RUN_ID" name="core-tests" xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010">
  <ResultSummary outcome="Completed" />
</TestRun>
"@ | Set-Content -Path "$resultsRoot\core-results.trx" -Encoding UTF8

@"
<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="core-tests" tests="1" failures="0" errors="0" skipped="0" />
"@ | Set-Content -Path "$resultsRoot\core-results.xml" -Encoding UTF8

@"
<?xml version="1.0" encoding="UTF-8"?>
<coverage line-rate="1" branch-rate="1" version="1.0">
  <sources>
    <source>$env:REPO_ROOT</source>
  </sources>
  <packages />
</coverage>
"@ | Set-Content -Path "$coverageRoot\coverage.xml" -Encoding UTF8

Copy-Item "$resultsRoot\*" "$artifactsRoot" -Force
Copy-Item "$coverageRoot\*" "$artifactsRoot" -Force

Compress-Archive -Path "$coverageRoot\*" -DestinationPath "$env:REPO_ROOT\coverage.zip" -Force
Compress-Archive -Path "$resultsRoot\*" -DestinationPath "$env:REPO_ROOT\test-results.zip" -Force

Write-PipelineLog "Test and packaging pipeline completed"

if ($clientExit -ne 0 -or $serverExit -ne 0) {
    throw "One or more test commands failed. clientExit=$clientExit serverExit=$serverExit"
}
