# 🔑 Gemini API Setup & Quota Guide

## ✅ Issue Fixed

The workflow now uses **Gemini 1.5 Flash** instead of Gemini 2.0 Flash Thinking, which is:
- ✅ Available on free tier
- ✅ Faster response times
- ✅ Still produces high-quality content
- ✅ Better quota limits

---

## 🚀 How to Get a Gemini API Key

### **Step 1: Go to Google AI Studio**
Visit: https://aistudio.google.com/app/apikey

### **Step 2: Create API Key**
1. Click **"Get API Key"** or **"Create API Key"**
2. Select or create a Google Cloud project
3. Copy your API key

### **Step 3: Add to Your App**
1. Go to: `http://localhost:4321/admin/settings`
2. Paste your API key in the **GEMINI_API_KEY** field
3. Click **Save Settings**

---

## 📊 Free Tier Limits

### **Gemini 1.5 Flash (Free)**
- ✅ **15 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **1 million requests per month**

**For article generation:**
- Each article = ~4-5 requests (3 passes + 1 meta)
- Free tier = **300-375 articles per day**
- More than enough for most use cases!

### **Gemini 1.5 Pro (Free)**
- ⚠️ **2 requests per minute**
- ⚠️ **50 requests per day**
- Only ~10 articles per day

---

## ⚠️ Common Quota Errors

### **Error: "429 Too Many Requests"**
**Cause**: Exceeded rate limit (15 requests/minute)

**Solutions**:
1. Wait 1 minute and try again
2. If generating many articles, add delays between generations
3. Upgrade to paid tier for higher limits

### **Error: "quota exceeded"**
**Cause**: Exceeded daily limit (1,500 requests/day)

**Solutions**:
1. Wait until next day (resets at midnight Pacific Time)
2. Upgrade to paid tier
3. Use multiple API keys (rotate)

### **Error: "model not found"**
**Cause**: Model not available in your region/tier

**Solutions**:
- Already fixed! Now using `gemini-1.5-flash-latest`
- Fallback to `gemini-1.5-flash` if needed

---

## 💰 Upgrade to Paid Tier (Optional)

### **When to Upgrade?**
- Generating 400+ articles per day
- Need faster rate limits (1000 requests/min)
- Need higher daily limits

### **Pricing (Pay-as-you-go)**
**Gemini 1.5 Flash:**
- $0.075 per 1M input tokens
- $0.30 per 1M output tokens

**Typical article cost:**
- Input: ~5,000 tokens = $0.000375
- Output: ~3,000 tokens = $0.0009
- **Total per article: ~$0.0013 (less than 1 cent!)**

**Monthly cost for 1000 articles:**
- 1000 articles × $0.0013 = **$1.30/month**

### **How to Upgrade**
1. Go to: https://console.cloud.google.com/billing
2. Enable billing on your project
3. Set spending limits (recommended)

---

## 🔧 Current Configuration

The system is now configured to:

1. **Use Gemini 1.5 Flash** (widely available, free tier)
2. **Automatic fallback** if model unavailable
3. **Better error messages** for quota issues
4. **Optimized token usage** (temperature: 0.8)

---

## 📝 Checking Your Quota

### **Method 1: API Key Quotas Page**
1. Visit: https://aistudio.google.com/app/apikey
2. Click on your API key
3. View usage and quotas

### **Method 2: Google Cloud Console**
1. Visit: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
2. Select your project
3. View detailed quota metrics

---

## 🎯 Best Practices

### **Optimize API Usage**
1. ✅ **Batch generation**: Generate multiple articles in sequence (not parallel)
2. ✅ **Add delays**: Wait 4-5 seconds between generations
3. ✅ **Monitor usage**: Check quota page weekly
4. ✅ **Use caching**: Don't regenerate same article multiple times

### **Avoid Quota Issues**
1. ❌ Don't spam the generate button
2. ❌ Don't run multiple generations simultaneously
3. ❌ Don't retry immediately after 429 error
4. ✅ Implement exponential backoff for retries

---

## 🆘 Troubleshooting

### **"API key not configured"**
- Go to Settings (`/admin/settings`)
- Add your Gemini API key
- Save settings

### **"Generation failed"**
1. Check console logs (F12 → Console)
2. Verify API key is correct
3. Check quota at https://aistudio.google.com/app/apikey
4. Try again in 1 minute

### **"News API failed"**
- Optional: NewsAPI has separate quotas (100/day free)
- System works without NewsAPI (just less current info)
- Get key at: https://newsapi.org

---

## ✨ You're All Set!

The system is now using **Gemini 1.5 Flash** which should work perfectly on the free tier!

**Test it:**
1. Go to: `http://localhost:4321/admin/auto-generate`
2. Enter a keyword (e.g., "ChatGPT features")
3. Select category
4. Click Generate
5. Wait 2-3 minutes for your article!

---

**Questions?** Check the console logs for detailed phase information during generation.
