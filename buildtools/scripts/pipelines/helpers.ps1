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
