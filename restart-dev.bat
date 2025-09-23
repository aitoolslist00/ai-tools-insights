@echo off
echo 🔄 AGGRESSIVE CACHE CLEARING AND RESTART...
echo.

REM Kill any existing npm processes
echo 🛑 Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Clear Next.js build cache
echo 🗑️ Clearing Next.js build cache...
if exist .next rmdir /s /q .next
if exist .next\cache rmdir /s /q .next\cache

REM Clear npm cache
echo 🗑️ Clearing npm cache...
npm cache clean --force 2>nul

echo ✅ All caches cleared!
echo 🚀 Starting fresh development server...
echo.
echo 📝 After server starts:
echo    1. Visit: http://localhost:3000/blog/ultimate-guide-ai-image-generators-2024
echo    2. Hard refresh with Ctrl+F5
echo    3. Check if content matches dashboard
echo.

npm run dev