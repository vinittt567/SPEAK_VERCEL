# 🚂 Railway Backend Deployment Guide

## Why Railway?
- ✅ **Free tier** with generous limits
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in database** (PostgreSQL/MongoDB)
- ✅ **Environment variables** management
- ✅ **Custom domains** support
- ✅ **Zero configuration** needed

## 🚀 Quick Deployment Steps

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Connect your GitHub repository

### Step 2: Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `vinittt567/SPEAK_VERCEL`
4. Railway will auto-detect Node.js project

### Step 3: Configure Build Settings
Railway should auto-detect, but verify:
- **Build Command**: `npm run build:server`
- **Start Command**: `npm start`
- **Root Directory**: `/` (entire project)

### Step 4: Add Environment Variables
In Railway dashboard, add:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
GOOGLE_GENAI_API_KEY=your-google-ai-key
```

### Step 5: Get Your Backend URL
Railway will provide a URL like:
`https://speak-backend-production.up.railway.app`

## 🔧 Railway Configuration

### Create `railway.json` (optional):
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Update `package.json` scripts:
```json
{
  "scripts": {
    "start": "node dist/server/node-build.mjs",
    "build": "npm run build:server",
    "deploy:railway": "railway up"
  }
}
```

## 💾 Database Options

### Option 1: Railway PostgreSQL (Recommended)
- Add PostgreSQL service in Railway
- Automatic connection string provided
- Update your models to use PostgreSQL

### Option 2: MongoDB Atlas (Current setup)
- Keep your existing MongoDB Atlas
- Add connection string to Railway environment variables

### Option 3: Railway MongoDB
- Add MongoDB service in Railway
- Get connection string from Railway dashboard

## 🌐 Connect Frontend to Backend

### Update Frontend Environment Variables
In Vercel dashboard, add:
```env
VITE_API_URL=https://your-railway-app.up.railway.app
```

### Update API calls in frontend:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Example API call
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});
```

## 🔄 Automatic Deployments

Once connected to GitHub:
- **Push to main** → Automatic backend deployment
- **Environment variables** → Managed in Railway dashboard
- **Logs** → Real-time logs in Railway dashboard
- **Scaling** → Automatic based on usage

## 💰 Pricing
- **Starter Plan**: Free ($0/month)
  - 512MB RAM
  - 1GB disk
  - $5 credit monthly
- **Developer Plan**: $5/month
  - 8GB RAM
  - 100GB disk
  - Priority support

## 📊 Monitoring
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, network usage
- **Uptime**: 99.9% uptime guarantee
- **Alerts**: Email notifications for issues