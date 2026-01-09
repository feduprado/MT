@echo off
setlocal

if exist "UpdateRoster.ps1" (
    set "TARGET_SCRIPT=UpdateRoster.ps1"
) else (
    if exist "Tools\UpdateRoster.ps1" (
        set "TARGET_SCRIPT=Tools\UpdateRoster.ps1"
    ) else (
        echo [ERRO] Nao foi possivel encontrar o script UpdateRoster.ps1.
        echo Voce esta executando de: %CD%
        pause
        exit /b 1
    )
)

set "PS_CMD=powershell.exe"
where pwsh >nul 2>&1
if %errorlevel% equ 0 set "PS_CMD=pwsh.exe"

"%PS_CMD%" -NoProfile -ExecutionPolicy Bypass -File "%TARGET_SCRIPT%"

if %errorlevel% neq 0 (
    echo [ERRO] O script PowerShell retornou erro.
    exit /b %errorlevel%
)

endlocal