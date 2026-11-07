@echo off
rem Sync the NavalVault Obsidian vault into vault-data.js.
rem   tools\sync-vault.cmd              export only
rem   tools\sync-vault.cmd --publish    export, commit, push
rem   tools\sync-vault.cmd --watch      re-export on every note change
setlocal enabledelayedexpansion

set "NODE_EXE="
where node >nul 2>nul && set "NODE_EXE=node"
if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_EXE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
if not defined NODE_EXE if exist "%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe" set "NODE_EXE=%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"

if not defined NODE_EXE (
  echo Node.js was not found. Install it from https://nodejs.org, then run this again.
  exit /b 1
)

"%NODE_EXE%" "%~dp0sync-vault.mjs" %*
exit /b %ERRORLEVEL%
