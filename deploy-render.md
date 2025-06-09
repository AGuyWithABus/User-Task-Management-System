# Quick Render Deployment Checklist

## 🚀 Deploy Backend to Render

### Step 1: Create Render Service
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `your-app-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 2: Set Environment Variables
Add these in Render dashboard → Environment:

```
NODE_ENV=production
RAPIDAPI_KEY=your-rapidapi-key-here
FRONTEND_URL=https://your-frontend.vercel.app
DATABASE_PATH=./database.sqlite
```

### Step 3: Update Frontend
In Vercel dashboard → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-app-backend.onrender.com
```

### Step 4: Test
```bash
curl https://your-app-backend.onrender.com/health
```

## 🎯 Alternative: Railway Deployment

If you prefer Railway:

1. Go to [railway.app](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Set **Root Directory**: `backend`
5. Add same environment variables
6. Deploy!

## 🎯 Alternative: DigitalOcean App Platform

1. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. **"Create App"** → **"GitHub"**
3. Select repository and `backend` folder
4. Configure build settings
5. Add environment variables
6. Deploy!

---

**Choose the platform that works best for you!** All three options will work perfectly with your Node.js backend.
