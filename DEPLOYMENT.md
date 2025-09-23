# Deployment Guide - AI Tools List

This guide covers how to deploy your AI Tools List website to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-tools-list)

### Manual Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Domain**
   - Go to your Vercel dashboard
   - Add custom domain: `www.aitoolslist.com`
   - Configure DNS settings as instructed

## 🌐 Other Deployment Options

### Netlify

1. **Build Command:** `npm run build`
2. **Publish Directory:** `.next`
3. **Environment Variables:** Copy from `.env.example`

### AWS Amplify

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure build:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Set environment variables

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://www.aitoolslist.com
NEXT_PUBLIC_SITE_NAME=AI Tools List

# Optional Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Optional Email Service
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_AUDIENCE_ID=your-audience-id
```

## 📊 Analytics Setup

### Google Analytics 4

1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `NEXT_PUBLIC_GA_ID` environment variable

### Google Tag Manager

1. Create GTM container
2. Get Container ID (GTM-XXXXXXX)
3. Add to `NEXT_PUBLIC_GTM_ID` environment variable

## 📧 Email Integration

### Mailchimp Setup

1. Create Mailchimp account
2. Generate API key
3. Create audience and get Audience ID
4. Add to environment variables

### Contact Form Setup

1. Configure `CONTACT_EMAIL` environment variable
2. Set up email service (SendGrid, Mailgun, etc.)
3. Update contact form handler

## 🔍 SEO Configuration

### Search Console

1. Verify ownership of `www.aitoolslist.com`
2. Submit sitemap: `https://www.aitoolslist.com/sitemap.xml`
3. Monitor indexing status

### Bing Webmaster Tools

1. Verify ownership
2. Submit sitemap
3. Monitor performance

## 🚦 Performance Optimization

### Image Optimization

- Images are automatically optimized by Next.js
- Consider using a CDN for better performance
- Add image domains to `next.config.js`

### Caching

- Static pages are cached automatically
- Configure CDN caching headers
- Use Vercel Edge Network for global distribution

## 🔒 Security Headers

Security headers are configured in `vercel.json`:

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## 📱 PWA Configuration (Optional)

To make the site a Progressive Web App:

1. Install `next-pwa`:
   ```bash
   npm install next-pwa
   ```

2. Update `next.config.js`:
   ```javascript
   const withPWA = require('next-pwa')({
     dest: 'public'
   })
   
   module.exports = withPWA({
     // existing config
   })
   ```

3. Add manifest.json and service worker

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Monitoring

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Hotjar for user behavior

### Performance Monitoring

- Vercel Analytics (built-in)
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## 🔧 Custom Domain Setup

### DNS Configuration

For `www.aitoolslist.com`:

1. **A Record:** `@` → Vercel IP
2. **CNAME Record:** `www` → `cname.vercel-dns.com`
3. **MX Records:** For email (if needed)

### SSL Certificate

- Automatically provided by Vercel
- Renews automatically
- Supports custom domains

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (use 18.x)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Restart deployment after changes

3. **Domain Issues**
   - Verify DNS propagation
   - Check SSL certificate status
   - Ensure proper redirects

### Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Issues: Create issue in repository

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Custom domain DNS configured
- [ ] Analytics tracking codes added
- [ ] Contact form tested
- [ ] Newsletter signup tested
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags verified
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Performance optimized
- [ ] Security headers configured

## 🎉 Post-Deployment

1. **Test all functionality**
2. **Submit to search engines**
3. **Set up monitoring**
4. **Configure analytics**
5. **Test contact forms**
6. **Verify newsletter signup**
7. **Check mobile experience**
8. **Monitor performance**

Your AI Tools Insights website is now ready for production! 🚀