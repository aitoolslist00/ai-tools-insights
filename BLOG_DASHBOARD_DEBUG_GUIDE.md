# Blog Dashboard Debugging Guide

## Overview
This guide provides comprehensive debugging tools and solutions for the AI Tools blog dashboard issues, specifically addressing problems with content updates not appearing and image upload failures.

## Current Issues Identified

### 1. Authentication Inconsistencies
**Problem**: Different APIs using different auth systems
**Solution**: Standardized all APIs to use `auth-enhanced` system

### 2. Cache Invalidation Problems
**Problem**: Changes not appearing immediately on the live site
**Solution**: Enhanced revalidate API with better error handling and debugging

### 3. Image Upload Issues
**Problem**: Image uploads failing in production environment
**Solution**: Improved upload API with proper directory creation and error logging

## Debugging Tools Implemented

### 1. BlogSystemDiagnostics Component
Location: `components/BlogSystemDiagnostics.tsx`

**Features:**
- Real-time system health monitoring
- File system status checks
- Authentication verification
- Performance metrics
- Content statistics

**Usage:**
```tsx
import BlogSystemDiagnostics from '@/components/BlogSystemDiagnostics'

// Component automatically runs diagnostics on mount
<BlogSystemDiagnostics />
```

### 2. Debug API Endpoint
Location: `app/api/blog/debug/route.ts`

**Features:**
- System environment information
- File system permissions testing
- Blog posts analysis
- API endpoint status

**Usage:**
```bash
GET /api/blog/debug
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "debug": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "system": {
      "platform": "linux",
      "nodeVersion": "v18.17.0",
      "cwd": "/app"
    },
    "files": {
      "blogPostsFile": {
        "path": "/app/blog-posts.json",
        "exists": true,
        "size": 12345,
        "lastModified": "2024-01-01T00:00:00.000Z"
      },
      "uploadsDir": {
        "path": "/app/public/uploads",
        "exists": true,
        "writable": true
      }
    },
    "posts": {
      "total": 25,
      "published": 20,
      "drafts": 5,
      "withImages": 15
    }
  }
}
```

## Enhanced APIs

### 1. Upload API (`app/api/upload/route.ts`)
**Improvements:**
- Comprehensive error logging
- Directory creation with proper permissions
- File validation and security checks
- SEO-optimized filename generation
- Write permission testing

### 2. Revalidate API (`app/api/revalidate/route.ts`)
**Improvements:**
- Enhanced error handling
- Development mode aggressive revalidation
- Individual post revalidation
- Cache tag management

### 3. Unified Blog API (`app/api/blog/unified/route.ts`)
**Improvements:**
- Consistent authentication
- Detailed logging for debugging
- Better error responses

## Dashboard Integration

The diagnostics are now integrated into the blog dashboard at `/blog/dashboard`:

1. **System Diagnostics Section**: Shows real-time system health
2. **Modal View**: Detailed diagnostics in a modal overlay
3. **Auto-refresh**: Diagnostics update automatically
4. **Error Handling**: Clear error messages and retry options

## Debugging Workflow

### Step 1: Access Dashboard
1. Navigate to `https://www.aitoolsinsights.com/blog/dashboard`
2. Log in with admin credentials
3. Check the System Diagnostics section at the top

### Step 2: Run Diagnostics
1. The diagnostics run automatically on page load
2. Click "Refresh" to run again
3. Check for any red status indicators

### Step 3: Identify Issues
Common issues and their indicators:

**File System Issues:**
- ❌ Blog Posts File: File doesn't exist or can't be read
- ❌ Uploads Directory: Directory doesn't exist
- ❌ Write Permissions: Can't write to uploads directory

**Authentication Issues:**
- Error: "Authentication required"
- Error: "Unauthorized access"

**API Issues:**
- HTTP 500 errors in diagnostics
- Failed API calls in browser console

### Step 4: Resolve Issues

**For File System Issues:**
1. Check server file permissions
2. Ensure uploads directory exists
3. Verify blog-posts.json is readable/writable

**For Authentication Issues:**
1. Clear browser cache and cookies
2. Log out and log back in
3. Check auth token expiration

**For API Issues:**
1. Check server logs
2. Verify API endpoints are accessible
3. Test with curl or Postman

## Production Deployment Checklist

### Environment Variables
Ensure these are set in production:
```bash
BLOG_AUTH_SECRET=your-secret-key
NODE_ENV=production
```

### File Permissions
```bash
# Ensure proper permissions
chmod 755 public/uploads
chmod 644 blog-posts.json
```

### Server Configuration
- Ensure Node.js has write permissions to the app directory
- Verify uploads directory is accessible via web server
- Check that revalidation works in production environment

## Monitoring and Maintenance

### Regular Checks
1. **Daily**: Check diagnostics for any red indicators
2. **Weekly**: Review upload directory size and cleanup old files
3. **Monthly**: Backup blog-posts.json file

### Performance Monitoring
- Monitor file sizes (blog-posts.json shouldn't exceed 1MB)
- Check upload directory disk usage
- Monitor API response times

### Troubleshooting Common Issues

**Issue**: Changes not appearing on live site
**Solution**: 
1. Check diagnostics for cache issues
2. Use "Force Refresh" in development
3. Manually call revalidate API

**Issue**: Image uploads failing
**Solution**:
1. Check uploads directory permissions
2. Verify file size limits
3. Check server disk space

**Issue**: Authentication errors
**Solution**:
1. Clear browser storage
2. Check auth token validity
3. Verify auth secret is set correctly

## Development vs Production

### Development Mode
- Aggressive cache clearing
- Detailed console logging
- Real-time file watching
- Immediate updates

### Production Mode
- Optimized caching
- Error logging only
- Batch revalidation
- Performance optimized

## Support and Maintenance

For ongoing support:
1. Monitor the diagnostics dashboard regularly
2. Check server logs for errors
3. Keep backups of blog-posts.json
4. Update dependencies regularly

## API Testing

Use these curl commands to test APIs directly:

```bash
# Test debug endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://www.aitoolsinsights.com/api/blog/debug

# Test revalidate
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     https://www.aitoolsinsights.com/api/revalidate

# Test upload
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "file=@test-image.jpg" \
     https://www.aitoolsinsights.com/api/upload
```

This comprehensive debugging system should help identify and resolve any issues with the blog dashboard quickly and efficiently.