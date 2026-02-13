# Vercel Deployment Guide

## 🔴 Fix ERR_CONNECTION_REFUSED Error

The error occurs because the backend URL environment variable is not set in Vercel. Your app is trying to connect to `localhost:5000` instead of your Railway backend.

## ✅ Quick Fix Steps:

### 1. Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`car-service` or similar)
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://carservice-production-010c.up.railway.app`
   - **Environments**: ✅ Production ✅ Preview ✅ Development
6. Click **Save**

### 2. Redeploy Your Application

**IMPORTANT**: You MUST redeploy after adding the environment variable!

- Go to **Deployments** tab
- Click the **⋯** (three dots) on the latest deployment
- Click **Redeploy**
- Or push a new commit to trigger a new deployment

### 3. Verify It Works

After redeployment:
1. Open your browser's Developer Console (F12)
2. Look for the log: `🔗 Backend URL: https://carservice-production-010c.up.railway.app`
3. If you see `localhost:5000`, the env var wasn't set correctly

## 📋 Why This Happens

Vite embeds environment variables at **build time**, not runtime:
- ✅ `.env` file works for **local development**
- ❌ `.env` file is **NOT used** in Vercel production builds
- ✅ You **MUST** set env vars in Vercel dashboard

## 🔍 Debugging

Check the browser console for these logs:
- `🔗 Backend URL:` - Shows which URL is being used
- `🌍 Environment:` - Shows dev/prod mode
- `❌ ERROR:` - Warns if localhost is used in production

## 🛠️ Current Configuration

- **Backend URL**: `https://carservice-production-010c.up.railway.app`
- **Fallback**: `http://localhost:5000` (only used if env var missing)

## ⚠️ Common Mistakes

1. ❌ Setting env var but not redeploying
2. ❌ Setting env var only for "Production" (should be all environments)
3. ❌ Typo in variable name (must be exactly `VITE_BACKEND_URL`)
4. ❌ Wrong backend URL value
