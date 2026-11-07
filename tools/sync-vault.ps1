<#
.SYNOPSIS
    Export the NavalVault Obsidian vault into vault-data.js, and optionally publish it.

.DESCRIPTION
    The site cannot read Obsidian directly, so this wrapper runs tools/sync-vault.mjs and
    (with -Publish) commits and pushes the regenerated vault-data.js to GitHub.

.EXAMPLE
    .\tools\sync-vault.ps1
    .\tools\sync-vault.ps1 -Publish
    .\tools\sync-vault.ps1 -Watch
#>
[CmdletBinding()]
param(
    [switch]$Watch,
    [switch]$Publish,
    [string]$Vault,
    [string]$Message = "Sync vault notes"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

function Resolve-Node {
    $cmd = Get-Command node -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $candidates = @(
        "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
        "C:\Program Files\nodejs\node.exe",
        "$env:USERPROFILE\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    throw "Node.js was not found. Install it from https://nodejs.org, or run with -Vault from a machine that has it."
}

function Resolve-Git {
    $cmd = Get-Command git -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    foreach ($candidate in @("C:\Program Files\Git\cmd\git.exe", "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe")) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    throw "git was not found. Install Git for Windows."
}

$node = Resolve-Node
$cli = @((Join-Path $PSScriptRoot "sync-vault.mjs"))
if ($Vault) { $cli += @("--vault", $Vault) }
if ($Watch) { $cli += "--watch" }

& $node @cli
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
if ($Watch -or -not $Publish) { exit 0 }

# ---- publish -------------------------------------------------------------
$git = Resolve-Git
Push-Location $root
try {
    & $git add vault-data.js
    $pending = & $git status --porcelain vault-data.js
    if (-not $pending) {
        Write-Host "No vault changes to publish."
        return
    }

    & $git -c http.sslBackend=openssl commit -m $Message | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Commit failed." }

    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $gh) {
        $fallback = "C:\Program Files\GitHub CLI\gh.exe"
        if (Test-Path -LiteralPath $fallback) { $gh = Get-Item $fallback }
    }
    if (-not $gh) { throw "GitHub CLI (gh) was not found, so the push cannot be authenticated." }

    $token = (& $gh.Source auth token).Trim()
    if (-not $token) { throw "gh has no token. Run: gh auth login" }

    $basic = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("x-access-token:$token"))
    $env:GIT_TERMINAL_PROMPT = "0"
    $env:GIT_CONFIG_COUNT = "1"
    $env:GIT_CONFIG_KEY_0 = "http.https://github.com/.extraHeader"
    $env:GIT_CONFIG_VALUE_0 = "AUTHORIZATION: basic $basic"

    & $git push
    if ($LASTEXITCODE -ne 0) { throw "Push failed." }
    Write-Host "Published vault notes to GitHub."
}
finally {
    Pop-Location
}
