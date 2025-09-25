# 🎨 Render Backend Deployment Guide

## Why Render?
- ✅ **Free tier** with 750 hours/month
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in SSL** certificates
- ✅ **Environment variables** management
- ✅ **Auto-scaling** capabilities
- ✅ **Zero downtime** deployments
- ✅ **Built-in monitoring** and logs

## 🚀 Quick Deployment Steps

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect to GitHub repository: `vinittt567/SPEAK_VERCEL`
3. Configure service settings:
   - **Name**: `speak-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`

### Step 3: Configure Build Settings
```
Build Command: npm install && npm run build:server
Start Command: npm start
```

### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:

**Required:**
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

**Optional (for AI features):**
```env
GOOGLE_GENAI_API_KEY=your-google-ai-key
VITE_VAPI_PUBLIC_API_KEY=your-vapi-key
VITE_VAPI_ASSISTANT_ID=your-vapi-assistant-id
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Get your backend URL: `https://speak-backend.onrender.com`

## 🔧 Configuration Files

### `render.yaml` (Infrastructure as Code)
```yaml
services:
  - type: web
    name: speak-backend
    env: node
    plan: free
    buildCommand: npm install && npm run build:server
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /api/ping
```

### Update `package.json` scripts:
```json
{
  "scripts": {
    "start": "node dist/server/node-build.mjs",
    "build:server": "vite build --config vite.config.server.ts",
    "deploy:render": "git push origin main"
  }
}
```

## 🌐 Connect Frontend to Backend

### Step 1: Update Frontend Environment Variables
In your Vercel dashboard, add:
```env
VITE_API_URL=https://speak-backend.onrender.com
```

### Step 2: Update API Configuration
Create/update `SPEAK/client/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  baseURL: API_BASE_URL,
  
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },
  
  // AI endpoints
  ai: {
    chat: `${API_BASE_URL}/api/ai/chat`,
    generate: `${API_BASE_URL}/api/ai/generate`,
  },
  
  // Other endpoints
  counselors: `${API_BASE_URL}/api/counselors`,
  ping: `${API_BASE_URL}/api/ping`,
};

// Helper function for API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
}
```

### Step 3: Update CORS Configuration
In your backend `server/index.ts`, update CORS:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://mystic-forge-iqmmq3jsl-vinit-kalambes-projects.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

## 💾 Database Options

### Option 1: MongoDB Atlas (Recommended)
- Keep your existing MongoDB Atlas setup
- Add connection string to Render environment variables
- No additional setup needed

### Option 2: Render PostgreSQL
- Add PostgreSQL database in Render
- Update your models to use PostgreSQL
- Automatic connection string provided

## 🔄 Automatic Deployments

### GitHub Integration:
- **Push to main** → Automatic deployment
- **Pull requests** → Preview deployments (paid plans)
- **Environment variables** → Managed in Render dashboard
- **Build logs** → Real-time in Render dashboard

### Deployment Process:
1. Code pushed to GitHub
2. Render detects changes
3. Runs build command
4. Deploys new version
5. Zero-downtime deployment

## 📊 Monitoring & Logs

### Built-in Features:
- **Real-time logs** - View application logs
- **Metrics** - CPU, memory, response times
- **Health checks** - Automatic endpoint monitoring
- **Alerts** - Email notifications for issues
- **Uptime monitoring** - 99.9% uptime SLA

### Health Check Endpoint:
Your `/api/ping` endpoint will be used for health checks:
```typescript
app.get("/api/ping", (_req, res) => {
  res.json({ 
    message: "SPEAK Backend is running",
    timestamp: new Date().toISOString(),
    status: "healthy"
  });
});
```

## 🔒 Security Features

### Automatic HTTPS:
- SSL certificates auto-generated
- HTTP to HTTPS redirects
- TLS 1.3 support

### Environment Variables:
- Encrypted at rest
- Secure injection at runtime
- No exposure in logs

## 💰 Pricing

### Free Tier:
- **750 hours/month** (enough for 24/7 if only one service)
- **512MB RAM**
- **0.1 CPU**
- **Automatic sleep** after 15 minutes of inactivity
- **Cold start** delay (~30 seconds)

### Starter Plan ($7/month):
- **No sleep/cold starts**
- **512MB RAM**
- **0.5 CPU**
- **Custom domains**
- **Priority support**

## 🚀 Deployment Commands

### Initial Deployment:
```bash
# Commit render configuration
git add render.yaml RENDER_BACKEND_DEPLOYMENT.md
git commit -m "Add Render deployment configuration"
git push origin main

# Render will automatically deploy from GitHub
```

### Manual Deployment:
```bash
# Install Render CLI (optional)
npm install -g @render/cli

# Deploy manually
render deploy
```

## 🔧 Troubleshooting

### Common Issues:

**Build Fails:**
- Check build logs in Render dashboard
- Verify `npm run build:server` works locally
- Check Node.js version compatibility

**App Won't Start:**
- Verify start command: `npm start`
- Check that `dist/server/node-build.mjs` exists after build
- Review application logs

**Database Connection Issues:**
- Verify MongoDB connection string
- Check network access from Render IPs
- Test connection locally with same credentials

**CORS Errors:**
- Add your Vercel domain to CORS origins
- Include both preview and production URLs

### Debug Commands:
```bash
# Test build locally
npm run build:server

# Test start command
npm start

# Check if server responds
curl http://localhost:3000/api/ping
```

## 🎯 Post-Deployment Checklist

After deployment, verify:
- [ ] **Backend URL accessible**: `https://speak-backend.onrender.com/api/ping`
- [ ] **Database connected**: Check logs for connection success
- [ ] **Environment variables set**: All required vars configured
- [ ] **Frontend connected**: Update VITE_API_URL in Vercel
- [ ] **CORS configured**: Frontend can make API calls
- [ ] **Health check working**: `/api/ping` returns 200
- [ ] **Authentication working**: Login/register endpoints functional

## 🌍 Global Performance

### CDN & Edge:
- **Global CDN** for static assets
- **Edge locations** worldwide
- **HTTP/2 & HTTP/3** support
- **Brotli compression** automatic

### Optimization Tips:
- Use connection pooling for database
- Implement caching for frequent queries
- Add request rate limiting
- Use compression middleware

## 🎉 Success!

Once deployed, your SPEAK backend will be available at:
- **Backend API**: `https://speak-backend.onrender.com`
- **Health Check**: `https://speak-backend.onrender.com/api/ping`
- **Dashboard**: Render dashboard for monitoring

Your full-stack SPEAK platform will then be:
- **Frontend**: Vercel (https://mystic-forge-iqmmq3jsl-vinit-kalambes-projects.vercel.app)
- **Backend**: Render (https://speak-backend.onrender.com)
- **Database**: MongoDB Atlas

Ready to help users worldwide with mental health support! 🌿✨