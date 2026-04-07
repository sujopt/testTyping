Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. "$PSScriptRoot\helpers.ps1"

if (-not $env:REPO_ROOT) {
    $env:REPO_ROOT = (Resolve-Path "$PSScriptRoot\..\..\..").Path
}

Write-PipelineLog "Starting build pipeline. Configuration=$env:BUILD_CONFIGURATION"

Push-Location "$env:REPO_ROOT\client"
try {
    npm install
    npm run build
}
finally {
    Pop-Location
}

Write-PipelineLog "Build pipeline completed"
