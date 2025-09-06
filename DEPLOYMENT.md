# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy the Finance Flow frontend to GitHub Pages.

## ⚠️ Important Considerations

**This is a full-stack application** - the frontend requires a backend API to function properly. You'll need to deploy both:

1. **Frontend** → GitHub Pages (this guide)
2. **Backend** → A cloud service (see Backend Deployment section)

## 📋 Prerequisites

- GitHub account
- Repository pushed to GitHub
- Backend API deployed to a cloud service

## 🎯 Frontend Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to main

### 3. Configure Environment Variables (Optional)

If you want to use a different API URL for production:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `VITE_API_URL`
4. Value: Your production API URL (e.g., `https://your-api.railway.app`)

## 🔧 Backend Deployment Options

You need to deploy your backend to a cloud service. Here are the best options:

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub
4. Select your repository
5. Railway will automatically detect it's a Node.js app
6. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret
   - `CONTACT_EMAIL_USER`: Your email
   - `CONTACT_EMAIL_PASS`: Your app password
7. Deploy!

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure build and start commands:
   - Build: `cd backend && npm install`
   - Start: `cd backend && node index.mjs`
5. Add environment variables
6. Deploy!

### Option 3: Heroku

1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
4. Set environment variables
5. Deploy: `git push heroku main`

## 🔄 Database Setup for Production

You'll need a production PostgreSQL database:

### Option 1: Railway PostgreSQL

- Railway provides PostgreSQL addon
- Automatically creates `DATABASE_URL`

### Option 2: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Use as `DATABASE_URL`

### Option 3: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create new database
3. Get connection string
4. Use as `DATABASE_URL`

## 🎯 Final Steps

1. **Deploy Backend** to your chosen service
2. **Get Backend URL** (e.g., `https://your-api.railway.app`)
3. **Update Frontend Environment**:
   - Set `VITE_API_URL` secret in GitHub
   - Or update `.env` file with production URL
4. **Push to GitHub** - deployment happens automatically!

## 🌐 Access Your App

Once deployed:

- **Frontend**: `https://yourusername.github.io/Finanace-Flow-Updated/`
- **Backend**: `https://your-api.railway.app` (or your chosen service)

## 🐛 Troubleshooting

### Frontend Issues

- Check if GitHub Actions workflow is running
- Verify environment variables are set correctly
- Check browser console for API connection errors

### Backend Issues

- Verify database connection
- Check environment variables
- Ensure CORS is configured for your frontend domain

### Database Issues

- Run Prisma migrations: `npx prisma db push`
- Seed data: `node seed-iron-man-data.js`

## 📝 Sample Credentials

After deployment, you can use these credentials to test:

- **Email**: `tony@stark.com`
- **Password**: `password123`

## 🔒 Security Notes

- Change default JWT secret in production
- Use strong passwords
- Enable HTTPS
- Consider rate limiting for API
- Regularly update dependencies

---

**Need help?** Check the [Issues](https://github.com/yourusername/Finanace-Flow-Updated/issues) page or create a new issue!
