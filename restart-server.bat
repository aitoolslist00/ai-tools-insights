@echo off
echo ========================================
echo Complete Server Restart for Blog Auth
echo ========================================
echo.

echo Step 1: Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Node.js processes terminated
) else (
    echo ℹ No Node.js processes found
)

timeout /t 2 /nobreak >nul

echo.
echo Step 2: Cleaning build cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ .next folder removed
) else (
    echo ℹ .next folder already clean
)

timeout /t 1 /nobreak >nul

echo.
echo Step 3: Verifying environment variables...
findstr /C:"ADMIN_USERNAME" .env.local >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ ADMIN_USERNAME found in .env.local
) else (
    echo ✗ ADMIN_USERNAME missing!
)

findstr /C:"ADMIN_PASSWORD_HASH" .env.local >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ ADMIN_PASSWORD_HASH found in .env.local
) else (
    echo ✗ ADMIN_PASSWORD_HASH missing!
)

echo.
echo Step 4: Starting fresh dev server...
echo ========================================
echo Server starting... Press Ctrl+C to stop
echo ========================================
echo.

npm run dev