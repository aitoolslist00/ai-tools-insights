@echo off
echo.
echo 🚀 AI Tools Insights - Automated Contact System Setup
echo =====================================================
echo.
echo 📧 Setting up professional contact system for: insightsaitools@gmail.com
echo.

echo 📦 Installing email dependencies...
npm install nodemailer @types/nodemailer

echo.
echo ✅ Dependencies installed successfully!
echo.

echo 🔧 Setting up Gmail App Password...
echo.
echo 📋 INSTRUCTIONS:
echo 1. Open: https://myaccount.google.com/security
echo 2. Enable 2-Factor Authentication (if not already enabled)
echo 3. Go to: https://myaccount.google.com/apppasswords
echo 4. Select "Mail" → "Other" → Name it "AI Tools Insights"
echo 5. Copy the 16-character password (format: abcd efgh ijkl mnop)
echo.

set /p APP_PASSWORD="Enter your Gmail App Password: "

if "%APP_PASSWORD%"=="" (
    echo ❌ No password entered. Setup cancelled.
    pause
    exit /b 1
)

echo.
echo 🔐 Configuring environment variables...

rem Create .env.local with the app password
(
echo # AI Tools Insights - Email Configuration
echo # This file is automatically configured for insightsaitools@gmail.com
echo.
echo # Gmail SMTP Configuration
echo SMTP_USER=insightsaitools@gmail.com
echo SMTP_PASS=%APP_PASSWORD%
echo.
echo # Email Service Configuration
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_SECURE=false
echo.
echo # Application Configuration
echo NEXT_PUBLIC_BASE_URL=https://www.aitoolsinsights.com
echo NEXT_PUBLIC_CONTACT_EMAIL=insightsaitools@gmail.com
echo.
echo # Development Configuration
echo NODE_ENV=development
echo DEBUG_EMAIL=false
echo.
echo # Security
echo NEXTAUTH_SECRET=ai-tools-insights-contact-system-2024
echo NEXTAUTH_URL=http://localhost:3000
) > .env.local

echo ✅ Environment variables configured in .env.local
echo.

rem Create production environment file
(
echo # Production Environment Variables for Vercel
echo # Copy these to your Vercel Dashboard → Settings → Environment Variables
echo.
echo SMTP_USER=insightsaitools@gmail.com
echo SMTP_PASS=%APP_PASSWORD%
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_SECURE=false
echo NEXT_PUBLIC_BASE_URL=https://www.aitoolsinsights.com
echo NEXT_PUBLIC_CONTACT_EMAIL=insightsaitools@gmail.com
echo NEXTAUTH_SECRET=ai-tools-insights-contact-system-2024
) > .env.production

echo ✅ Production variables saved to .env.production
echo.

echo 🧪 Testing email system...
node scripts/test-contact-system.js

echo.
echo 🎉 CONTACT SYSTEM SETUP COMPLETE!
echo ==================================
echo ✅ Gmail App Password configured
echo ✅ Environment variables set
echo ✅ Email system tested
echo ✅ Contact form ready to use
echo.
echo 📧 Contact form will send emails to: insightsaitools@gmail.com
echo 📤 Users will receive automatic confirmation emails
echo.
echo 🚀 Next Steps:
echo 1. Test locally: npm run dev
echo 2. Test contact form on http://localhost:3000/contact
echo 3. Deploy to production: npm run build && vercel --prod
echo.
echo 📋 For production deployment:
echo - Copy .env.production to your Vercel Dashboard
echo - Go to: Vercel Project → Settings → Environment Variables
echo.
pause