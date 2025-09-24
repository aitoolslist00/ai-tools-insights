# Production Deployment Guide

This guide will help you fix the blog publishing and image upload issues in production.

## Issues Fixed

1. **Articles save but don't appear on public blog pages**
2. **Image upload fails in production**
3. **Missing authentication environment variables**

## Required Environment Variables

Add these environment variables in your Vercel Dashboard (Settings → Environment Variables):

### Authentication (REQUIRED)
```
ADMIN_USERNAME=ahmedibrahim
ADMIN_PASSWORD_HASH=$2b$12$YzgAzvsa48RtqclLs0LNgeRRMiItxoh9ZwDmuFzY3irIwqQ88pdFG
JWT_SECRET=ai-tools-insights-blog-jwt-secret-2024-production
```

### Blog Storage Configuration
```
BLOG_STORAGE_TYPE=vercel-kv
```

### Image Upload Configuration
```
UPLOAD_PROVIDER=vercel-blob
```

## Step 1: Set Up Vercel KV (for blog storage)

1. Go to your Vercel Dashboard
2. Navigate to Storage → Create Database → KV
3. Create a new KV database named "ai-tools-blog"
4. Copy the environment variables and add them to your project:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

## Step 2: Set Up Vercel Blob (for image uploads)

1. Go to your Vercel Dashboard
2. Navigate to Storage → Create Database → Blob
3. Create a new Blob store named "ai-tools-images"
4. Copy the environment variable and add it to your project:
   - `BLOB_READ_WRITE_TOKEN`

## Step 3: Install Required Dependencies

Add these dependencies to your project:

```bash
npm install @vercel/kv @vercel/blob
```

## Step 4: Update package.json

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@vercel/kv": "^1.0.1",
    "@vercel/blob": "^0.15.1"
  }
}
```

## Step 5: Deploy

1. Commit all changes to your repository
2. Push to your main branch
3. Vercel will automatically deploy the changes

## Environment Variables Summary

Here's the complete list of environment variables you need to add in Vercel:

```
# Authentication
ADMIN_USERNAME=ahmedibrahim
ADMIN_PASSWORD_HASH=$2b$12$YzgAzvsa48RtqclLs0LNgeRRMiItxoh9ZwDmuFzY3irIwqQ88pdFG
JWT_SECRET=ai-tools-insights-blog-jwt-secret-2024-production

# Storage Configuration
BLOG_STORAGE_TYPE=vercel-kv
UPLOAD_PROVIDER=vercel-blob

# Vercel KV (from KV database setup)
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-rest-api-token

# Vercel Blob (from Blob store setup)
BLOB_READ_WRITE_TOKEN=your-blob-token

# Existing variables (keep these)
SMTP_USER=insightsaitools@gmail.com
SMTP_PASS=ljzr vmhh ofpb kfdx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
NEXT_PUBLIC_BASE_URL=https://www.aitoolsinsights.com
NEXT_PUBLIC_CONTACT_EMAIL=insightsaitools@gmail.com
NEXTAUTH_SECRET=ai-tools-insights-contact-system-2024
```

## Alternative: Use Memory Storage (Temporary Fix)

If you want a quick fix without setting up KV/Blob, you can use memory storage:

```
BLOG_STORAGE_TYPE=memory
UPLOAD_PROVIDER=local
```

**Warning**: Memory storage will lose all blog posts when the server restarts. This is only for testing.

## Testing the Fix

1. After deployment, go to `https://www.aitoolsinsights.com/blog/dashboard`
2. Login with your credentials
3. Try creating a new blog post
4. Try uploading an image
5. Publish the post and check if it appears on the public blog

## Troubleshooting

### If blog posts still don't appear:
1. Check the Vercel function logs for errors
2. Verify KV environment variables are set correctly
3. Try the "Refresh Blog" button in the dashboard

### If image uploads still fail:
1. Check the Vercel function logs for errors
2. Verify Blob environment variables are set correctly
3. Make sure the Blob store has public read access

### If authentication fails:
1. Verify all auth environment variables are set
2. Check that JWT_SECRET is set and matches
3. Clear browser localStorage and try logging in again

## Migration from File Storage

If you have existing blog posts in the file system, they will be automatically migrated to KV storage on first use. The system will:

1. Load existing posts from `blog-posts.json`
2. Save them to KV storage
3. Continue using KV storage for all future operations

## Performance Notes

- KV storage provides better performance and reliability than file storage
- Blob storage is optimized for images and provides CDN benefits
- Both services scale automatically with your traffic

## Cost Considerations

- Vercel KV: Free tier includes 30,000 requests/month
- Vercel Blob: Free tier includes 5GB storage and 100GB bandwidth/month
- Both should be sufficient for most blog usage patterns

## Support

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Verify all environment variables are set correctly
3. Test in development mode first to isolate issues