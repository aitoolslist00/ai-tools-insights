@echo off
echo Installing production dependencies for blog and image upload fixes...
echo.

echo Installing Vercel KV and Blob dependencies...
npm install @vercel/kv @vercel/blob

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Set up Vercel KV database in your Vercel dashboard
echo 2. Set up Vercel Blob store in your Vercel dashboard  
echo 3. Add the required environment variables (see PRODUCTION_DEPLOYMENT_GUIDE.md)
echo 4. Deploy to Vercel
echo.
echo For detailed instructions, see: PRODUCTION_DEPLOYMENT_GUIDE.md
echo.
pause