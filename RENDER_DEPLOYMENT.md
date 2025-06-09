# Render Backend Deployment Guide

Deploy your Node.js/Express backend to Render with this step-by-step guide.

## 🎯 Why Render?

- ✅ **Free tier available** (750 hours/month)
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in HTTPS**
- ✅ **Environment variables** management
- ✅ **Logs and monitoring**
- ✅ **SQLite support** (file-based database)

---

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **RapidAPI Key**: Get your key from [rapidapi.com](https://rapidapi.com)

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Backend

Your backend is already configured correctly with:
- ✅ `package.json` with proper scripts
- ✅ TypeScript build configuration
- ✅ Environment variable support
- ✅ CORS configuration for production

### Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)** and sign in
2. **Click "New +"** in the top right
3. **Select "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service:**

   **Basic Settings:**
   - **Name**: `your-app-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`

   **Build & Deploy:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

   **Advanced Settings:**
   - **Auto-Deploy**: `Yes` (deploys automatically on git push)

6. **Click "Create Web Service"**

### Step 3: Configure Environment Variables

After creating the service, add environment variables:

1. **In your Render dashboard**, go to your service
2. **Click "Environment"** in the left sidebar
3. **Add these environment variables:**

```bash
NODE_ENV=production
RAPIDAPI_KEY=your-rapidapi-key-here
FRONTEND_URL=https://your-frontend.vercel.app
DATABASE_PATH=./database.sqlite
```

**Important**: Replace `your-rapidapi-key-here` and `your-frontend.vercel.app` with your actual values.

### Step 4: Update Frontend API URL

Once your backend is deployed, update your frontend:

1. **Go to Vercel dashboard**
2. **Select your frontend project**
3. **Go to Settings → Environment Variables**
4. **Update `REACT_APP_API_URL`** to your Render backend URL:
   ```
   REACT_APP_API_URL=https://your-app-backend.onrender.com
   ```
5. **Redeploy frontend** (or it will auto-deploy)

---

## 🔧 Configuration Details

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `RAPIDAPI_KEY` | `your-key` | Your RapidAPI key for messaging |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Frontend URL for CORS |
| `DATABASE_PATH` | `./database.sqlite` | SQLite database file path |

### Build Configuration

Render will automatically:
1. **Install dependencies**: `npm install`
2. **Build TypeScript**: `npm run build`
3. **Start the server**: `npm start`

---

## 📱 Testing Your Deployment

### 1. Test Backend Health

```bash
# Test the health endpoint
curl https://your-app-backend.onrender.com/health

# Expected response:
# {"status":"OK","message":"Server is running"}
```

### 2. Test API Endpoints

```bash
# Test users endpoint
curl https://your-app-backend.onrender.com/users

# Test with your frontend
# Visit your Vercel URL and try creating users/tasks
```

### 3. Check Logs

1. **In Render dashboard**, go to your service
2. **Click "Logs"** to see real-time logs
3. **Monitor for any errors**

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
**Problem**: TypeScript compilation errors
**Solution**: 
- Check logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `cd backend && npm run build`

#### 2. Database Issues
**Problem**: SQLite file not found
**Solution**:
- SQLite files are created automatically
- Check `DATABASE_PATH` environment variable
- Database will be recreated on each deployment (ephemeral storage)

#### 3. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**:
- Verify `FRONTEND_URL` environment variable
- Check CORS configuration in `backend/src/server.ts`
- Ensure frontend `REACT_APP_API_URL` points to Render URL

#### 4. Environment Variables Not Working
**Problem**: API keys or URLs not loading
**Solution**:
- Check environment variables in Render dashboard
- Redeploy after adding/changing variables
- Verify variable names match exactly

---

## 💰 Render Pricing

### Free Tier
- ✅ **750 hours/month** (enough for personal projects)
- ✅ **Automatic sleep** after 15 minutes of inactivity
- ✅ **Cold start delay** (~30 seconds when waking up)

### Paid Plans (Starting $7/month)
- ✅ **Always-on** (no sleeping)
- ✅ **No cold starts**
- ✅ **More resources**
- ✅ **Custom domains**

---

## 🔄 Continuous Deployment

### Automatic Deployments

Render automatically deploys when you push to GitHub:

```bash
# Make changes to your backend
git add .
git commit -m "Update backend feature"
git push origin main

# Render automatically:
# 1. Detects the push
# 2. Builds the backend
# 3. Deploys to production
```

### Manual Deployment

You can also trigger manual deployments:

1. **In Render dashboard**, go to your service
2. **Click "Manual Deploy"**
3. **Select branch and deploy**

---

## 📊 Monitoring

### View Logs
```bash
# Real-time logs in Render dashboard
# Or use Render CLI (optional)
render logs -s your-service-name
```

### Monitor Performance
- **Response times** in Render dashboard
- **Error rates** and **uptime**
- **Resource usage** (CPU, memory)

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Render's environment variable management
- ✅ Rotate API keys regularly

### HTTPS
- ✅ Render provides automatic HTTPS
- ✅ All traffic is encrypted
- ✅ SSL certificates auto-renewed

### Database
- ✅ SQLite files are isolated per service
- ✅ Consider upgrading to PostgreSQL for production
- ✅ Regular backups recommended

---

## 🎉 You're Done!

Your backend is now deployed on Render with:
- ✅ Automatic deployments from GitHub
- ✅ Environment variables configured
- ✅ HTTPS enabled
- ✅ Monitoring and logs available

**Your backend is live at**: `https://your-app-backend.onrender.com`

### Next Steps:
1. ✅ Update frontend `REACT_APP_API_URL`
2. ✅ Test the full application
3. ✅ Monitor logs for any issues
4. ✅ Consider upgrading to paid plan for production use
