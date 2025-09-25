# 🚀 Vercel Deployment Guide

## ⚡ Quick Deployment (3 Steps)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate with Vercel.

### Step 3: Deploy
```bash
# Deploy to production
npm run deploy:vercel

# Or use Vercel CLI directly
vercel --prod
```

## 🔧 Detailed Setup

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository (already done ✅)
- Node.js 18+ installed

### Configuration Files
- ✅ `vercel.json` - Vercel configuration (already created)
- ✅ `package.json` - Build scripts configured
- ✅ Vite configuration - Optimized for static build

## 🌐 Deployment Options

### Option 1: CLI Deployment (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration (Automatic)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `vinittt567/SPEAK_VERCEL`
4. Configure build settings (auto-detected)
5. Deploy

### Option 3: Drag & Drop (Manual)
1. Build locally: `npm run build:client`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag the `dist/spa` folder
4. Deploy

## ⚙️ Build Configuration

### Vercel Settings (Auto-configured)
```json
{
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist/spa",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Environment Variables
In Vercel dashboard, add these environment variables:

**Required for Voice Features:**
- `VITE_VAPI_PUBLIC_API_KEY` - Your Vapi API key
- `VITE_VAPI_ASSISTANT_ID` - Your Vapi assistant ID

**Optional:**
- `VITE_API_URL` - Backend API URL (if different)
- `NODE_ENV` - Set to `production`

## 🔍 Deployment Process

### What Happens During Deployment:
1. **Install Dependencies** - `npm install`
2. **Build Client** - `npm run build:client`
3. **Deploy Static Files** - Upload `dist/spa` to Vercel CDN
4. **Configure Routing** - SPA routing setup
5. **Generate URL** - Get your live URL

### Expected Output:
```bash
🔍  Inspect: https://vercel.com/your-username/speak-vercel/xyz
✅  Production: https://speak-vercel-xyz.vercel.app
```

## 🌍 Custom Domain (Optional)

### Add Custom Domain:
1. Go to your project dashboard on Vercel
2. Click "Domains" tab
3. Add your domain (e.g., `speak.yourdomain.com`)
4. Configure DNS records as shown
5. SSL certificate auto-generated

## 📊 Vercel Features You Get

### Performance:
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Edge Network** - 100+ locations
- ✅ **Automatic Compression** - Gzip/Brotli
- ✅ **Image Optimization** - Automatic WebP conversion
- ✅ **HTTP/2 & HTTP/3** - Modern protocols

### Developer Experience:
- ✅ **Preview Deployments** - Every push gets a preview URL
- ✅ **Instant Rollbacks** - One-click rollback to previous versions
- ✅ **Real-time Logs** - Monitor deployment and runtime
- ✅ **Analytics** - Built-in web analytics

### Security:
- ✅ **HTTPS by Default** - Automatic SSL certificates
- ✅ **DDoS Protection** - Built-in security
- ✅ **Environment Variables** - Secure secret management

## 🎯 Post-Deployment Checklist

After deployment, verify:
- [ ] **Homepage loads** - Check your Vercel URL
- [ ] **All routes work** - Test /chat, /booking, /resources, etc.
- [ ] **Language switching** - Test English, Hindi, Kashmiri
- [ ] **Voice navigation** - Test Vapi integration (if configured)
- [ ] **Gamification** - Test /gamification page
- [ ] **Mobile responsive** - Test on different devices
- [ ] **Performance** - Check loading speeds

## 🔧 Troubleshooting

### Common Issues:

#### **Build Fails**
```bash
# Check build locally first
npm run build:client

# Check for TypeScript errors
npm run typecheck
```

#### **404 on Routes**
- Vercel.json should handle SPA routing automatically
- Check that `vercel.json` has correct rewrite rules

#### **Environment Variables Not Working**
- Add variables in Vercel dashboard
- Ensure they have `VITE_` prefix for client-side access
- Redeploy after adding variables

#### **Large Bundle Size Warning**
- Consider code splitting
- Use dynamic imports for large components
- Optimize images and assets

### Debug Commands:
```bash
# Test build locally
npm run build:client

# Serve built files locally
npx serve dist/spa

# Check Vercel project status
vercel ls

# View deployment logs
vercel logs
```

## 📱 Mobile & PWA Support

Your SPEAK app on Vercel will have:
- ✅ **Responsive Design** - Works on all devices
- ✅ **Fast Loading** - Optimized for mobile networks
- ✅ **Offline Support** - Service worker caching (if configured)
- ✅ **App-like Experience** - Can be added to home screen

## 🚀 Continuous Deployment

### Automatic Deployments:
Once connected to GitHub:
- **Push to main** → Automatic production deployment
- **Push to other branches** → Preview deployments
- **Pull requests** → Preview deployments with unique URLs

### Branch Strategy:
- `main` branch → Production (speak-vercel.vercel.app)
- `develop` branch → Staging (speak-vercel-git-develop.vercel.app)
- Feature branches → Preview deployments

## 📊 Analytics & Monitoring

### Built-in Analytics:
- **Page Views** - Track user engagement
- **Performance Metrics** - Core Web Vitals
- **Geographic Data** - Where users are located
- **Device Information** - Mobile vs desktop usage

### Access Analytics:
1. Go to Vercel dashboard
2. Select your project
3. Click "Analytics" tab
4. View real-time and historical data

## 💰 Pricing

### Hobby Plan (Free):
- ✅ **Unlimited personal projects**
- ✅ **100GB bandwidth/month**
- ✅ **Custom domains**
- ✅ **HTTPS certificates**
- ✅ **Preview deployments**

### Pro Plan ($20/month):
- ✅ **Everything in Hobby**
- ✅ **1TB bandwidth/month**
- ✅ **Team collaboration**
- ✅ **Advanced analytics**
- ✅ **Password protection**

## 🎉 Success!

Once deployed, your SPEAK platform will be available at:
- **Vercel URL**: `https://speak-vercel-xyz.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

Your app will have:
- ✅ **Global fast delivery**
- ✅ **Automatic HTTPS**
- ✅ **Preview deployments**
- ✅ **Real-time analytics**
- ✅ **Instant rollbacks**

## 📞 Support

If you encounter issues:
1. Check Vercel dashboard for deployment logs
2. Test build locally with `npm run build:client`
3. Review Vercel documentation
4. Check community forums
5. Contact Vercel support (Pro plan)

Your SPEAK mental health platform is ready to help users worldwide! 🌍