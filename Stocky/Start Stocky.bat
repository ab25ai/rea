@echo off
setlocal
set "NODE=%~dp0..\.tools\node_modules\node\bin\node.exe"
if exist "%NODE%" (
  "%NODE%" "%~dp0server.mjs"
) else (
  where py >nul 2>nul
  if errorlevel 1 (
    echo Could not find the project's Node.js runtime or Python launcher.
    echo Install Node.js or Python, then run this file again.
    pause
    exit /b 1
  )
  echo Starting Stocky at http://127.0.0.1:4173/
  py -m http.server 4173 --bind 127.0.0.1 --directory "%~dp0"
)
endlocal
