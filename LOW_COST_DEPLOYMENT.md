# 💰 Low-Cost Deployment Guide for Finance Flow

This guide shows you how to deploy your Finance Flow application for **$0-10/month** instead of $20/month.

## 🎯 Cost Comparison

| Option                         | Frontend | Backend  | Database | Total/Month |
| ------------------------------ | -------- | -------- | -------- | ----------- |
| **Digital Ocean App Platform** | Free     | $5       | $15      | **$20**     |
| **Free Tier Combo**            | Free     | Free     | Free     | **$0**      |
| **Single Droplet**             | Included | Included | Included | **$6**      |
| **Hybrid Approach**            | Free     | $6       | Free     | **$6**      |

## 🚀 Option 1: Free Tier Combination (RECOMMENDED)

**Total Cost: $0/month**

### Frontend: Vercel (Free)

1. **Deploy to Vercel:**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app`

### Backend: Railway (Free Tier)

1. **Deploy to Railway:**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Deploy
   cd backend
   railway init
   railway up
   ```

2. **Set Environment Variables:**
   ```bash
   railway variables set JWT_SECRET=your_secret_key
   railway variables set CONTACT_EMAIL_USER=your_email@gmail.com
   railway variables set CONTACT_EMAIL_PASS=your_app_password
   railway variables set DATABASE_URL=postgresql://username:password@host:port/database
   ```

### Database: Supabase (Free)

1. **Create Supabase Project:**

   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from Settings → Database

2. **Run Migrations:**
   ```bash
   cd backend
   npx prisma db push
   npx prisma db seed
   ```

## 🚀 Option 2: Single Digital Ocean Droplet ($6/month)

**Total Cost: $6/month**

### Step 1: Create Droplet

1. **Create Droplet:**

   - Go to Digital Ocean Dashboard
   - Create → Droplets
   - Choose Ubuntu 22.04 LTS
   - Select Basic $6/month plan
   - Add SSH key

2. **Connect to Droplet:**
   ```bash
   ssh root@your-droplet-ip
   ```

### Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/Finanace-Flow-Updated.git
cd Finanace-Flow-Updated

# Set up environment
cp env.production .env
# Edit .env with your values

# Deploy with Docker Compose
docker-compose -f docker-compose.single-server.yml up -d
```

### Step 4: Set Up Domain & SSL (Optional)

```bash
# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com
```

## 🚀 Option 3: Hybrid Approach ($6/month)

**Frontend: Vercel (Free) + Backend: Digital Ocean ($6) + Database: Supabase (Free)**

### Frontend: Vercel

- Deploy using `vercel.json` configuration
- Set `VITE_API_URL` to your Digital Ocean backend

### Backend: Digital Ocean Droplet

- Deploy only the backend using Docker
- Use the single-server configuration

### Database: Supabase

- Use free Supabase database
- Update `DATABASE_URL` in your backend

## 🔧 Configuration Files

### For Vercel Deployment

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

### For Railway Deployment

Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node index.mjs",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 📊 Detailed Cost Breakdown

### Option 1: Free Tier (RECOMMENDED)

- **Vercel**: Free (100GB bandwidth, unlimited deployments)
- **Railway**: Free (500 hours/month, $5 credit)
- **Supabase**: Free (500MB database, 50MB file storage)
- **Total**: $0/month

### Option 2: Single Droplet

- **Digital Ocean Droplet**: $6/month (1GB RAM, 1 vCPU, 25GB SSD)
- **Total**: $6/month

### Option 3: Hybrid

- **Vercel**: Free
- **Digital Ocean Droplet**: $6/month
- **Supabase**: Free
- **Total**: $6/month

## 🚀 Quick Start Commands

### Deploy to Vercel (Frontend)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Deploy to Railway (Backend)

```bash
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
```

### Deploy to Single Droplet

```bash
# On your local machine
git clone https://github.com/your-username/Finanace-Flow-Updated.git
cd Finanace-Flow-Updated

# On your droplet
docker-compose -f docker-compose.single-server.yml up -d
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit secrets
2. **Database**: Use SSL connections
3. **HTTPS**: Enable SSL certificates
4. **Firewall**: Configure proper firewall rules

## 🐛 Troubleshooting

### Common Issues

1. **Vercel Build Failures**:

   - Check build logs in Vercel dashboard
   - Verify `package.json` scripts

2. **Railway Deployment Issues**:

   - Check Railway logs
   - Verify environment variables

3. **Database Connection**:
   - Test connection string
   - Check firewall settings

## 🎯 Recommended Approach

**For Development/Small Projects**: Use Option 1 (Free Tier)
**For Production/Medium Projects**: Use Option 2 (Single Droplet)
**For High Traffic**: Use Option 3 (Hybrid) or upgrade to Digital Ocean App Platform

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review service-specific documentation
3. Check application logs
4. Create an issue in your GitHub repository

---

**Save Money, Deploy Smart! 💰🚀**
