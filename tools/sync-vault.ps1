<#
.SYNOPSIS
    Export the NavalVault Obsidian vault into vault-data.js.

.DESCRIPTION
    Thin wrapper around tools/sync-vault.mjs. Prefer tools\sync-vault.cmd when the
    PowerShell execution policy blocks local scripts.

.EXAMPLE
    .\tools\sync-vault.ps1
    .\tools\sync-vault.ps1 -Publish
    .\tools\sync-vault.ps1 -Watch
#>
[CmdletBinding()]
param(
    [switch]$Watch,
    [switch]$Publish,
    [string]$Vault
)

$ErrorActionPreference = "Stop"

function Resolve-Node {
    $cmd = Get-Command node -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    foreach ($candidate in @(
        "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
        "C:\Program Files\nodejs\node.exe",
        "$env:USERPROFILE\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
    )) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    throw "Node.js was not found. Install it from https://nodejs.org."
}

$node = Resolve-Node
$cli = @((Join-Path $PSScriptRoot "sync-vault.mjs"))
if ($Vault) { $cli += @("--vault", $Vault) }
if ($Watch) { $cli += "--watch" }
if ($Publish) { $cli += "--publish" }

& $node @cli
exit $LASTEXITCODE
