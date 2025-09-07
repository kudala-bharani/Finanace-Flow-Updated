# 🚀 Digital Ocean Deployment Guide for Finance Flow

This comprehensive guide will help you deploy your Finance Flow application (frontend + backend) to Digital Ocean using their App Platform.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] Digital Ocean account
- [ ] GitHub repository with your code
- [ ] Docker installed locally (for testing)
- [ ] Digital Ocean CLI (`doctl`) installed

## 🛠️ Installation & Setup

### 1. Install Digital Ocean CLI

**Windows (WSL/Linux):**

```bash
# Download and install doctl
wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
tar xf doctl-1.94.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin
```

**macOS:**

```bash
brew install doctl
```

**Verify installation:**

```bash
doctl version
```

### 2. Authenticate with Digital Ocean

```bash
doctl auth init
```

Enter your Digital Ocean API token when prompted.

## 🗄️ Database Setup

### Option 1: Digital Ocean Managed Database (Recommended)

1. **Create Database:**

   - Go to Digital Ocean Dashboard
   - Navigate to "Databases"
   - Click "Create Database"
   - Choose PostgreSQL 15
   - Select region closest to your users
   - Choose appropriate size (Basic for development)

2. **Get Connection String:**
   - After creation, go to your database
   - Click "Connection Details"
   - Copy the connection string
   - It will look like: `postgresql://username:password@host:port/database?sslmode=require`

### Option 2: External Database (Supabase/Neon)

If you prefer external databases:

- **Supabase**: Create project at [supabase.com](https://supabase.com)
- **Neon**: Create database at [neon.tech](https://neon.tech)

## 🚀 Deployment Methods

### Method 1: Digital Ocean App Platform (Recommended)

#### Step 1: Prepare Your Repository

1. **Update App Configuration:**

   ```bash
   # Edit .do/app-simple.yaml
   # Replace 'your-username' with your GitHub username
   # Replace 'Finanace-Flow-Updated' with your repository name
   ```

2. **Set Environment Variables:**
   Create a `.env` file in your project root:
   ```bash
   cp env.example .env
   # Edit .env with your production values
   ```

#### Step 2: Deploy via Digital Ocean Dashboard

1. **Create New App:**

   - Go to Digital Ocean Dashboard
   - Click "Apps" → "Create App"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Backend Service:**

   - **Source Directory**: `/backend`
   - **Build Command**: `npm ci && npx prisma generate`
   - **Run Command**: `node index.mjs`
   - **Environment**: Node.js
   - **Instance Size**: Basic ($5/month)

3. **Configure Frontend Static Site:**

   - **Source Directory**: `/`
   - **Build Command**: `npm ci && npm run build`
   - **Output Directory**: `dist`
   - **Environment**: Node.js

4. **Add Database:**

   - Click "Add Database"
   - Select your managed database
   - Or create a new one

5. **Set Environment Variables:**

   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key
   CONTACT_EMAIL_USER=your_email@gmail.com
   CONTACT_EMAIL_PASS=your_app_password
   DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
   VITE_API_URL=https://your-backend-app.ondigitalocean.app
   ```

6. **Deploy:**
   - Click "Create Resources"
   - Wait for deployment to complete

#### Step 3: Database Migration

After deployment, run database migrations:

1. **Connect to your backend service:**

   ```bash
   doctl apps ssh your-app-id --component backend
   ```

2. **Run migrations:**
   ```bash
   cd /workspace/backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Method 2: Docker Deployment

#### Step 1: Build Images

```bash
# Build backend
docker build -f Dockerfile.backend -t finance-flow-backend .

# Build frontend
docker build -f Dockerfile.frontend -t finance-flow-frontend .
```

#### Step 2: Deploy with Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Method 3: Manual Deployment

#### Step 1: Create Droplet

1. **Create Droplet:**

   - Go to Digital Ocean Dashboard
   - Click "Create" → "Droplets"
   - Choose Ubuntu 22.04 LTS
   - Select appropriate size (Basic $6/month minimum)
   - Add SSH key
   - Create droplet

2. **Connect to Droplet:**
   ```bash
   ssh root@your-droplet-ip
   ```

#### Step 2: Install Dependencies

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

#### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/Finanace-Flow-Updated.git
cd Finanace-Flow-Updated

# Set up environment
cp env.production .env
# Edit .env with your values

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Variables

| Variable             | Description                  | Example                                               |
| -------------------- | ---------------------------- | ----------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string | `postgresql://user:pass@host:port/db?sslmode=require` |
| `JWT_SECRET`         | Secret key for JWT tokens    | `your_super_secret_key_here`                          |
| `CONTACT_EMAIL_USER` | Email for contact form       | `your_email@gmail.com`                                |
| `CONTACT_EMAIL_PASS` | Email app password           | `your_app_password`                                   |
| `VITE_API_URL`       | Backend API URL              | `https://your-backend.ondigitalocean.app`             |
| `NODE_ENV`           | Environment                  | `production`                                          |

### Database Configuration

1. **Run Migrations:**

   ```bash
   npx prisma migrate deploy
   ```

2. **Seed Database:**
   ```bash
   node seed-iron-man-data.js
   ```

## 🌐 Domain & SSL

### Custom Domain (Optional)

1. **Add Domain to Digital Ocean:**

   - Go to "Networking" → "Domains"
   - Add your domain
   - Update DNS records

2. **Configure App:**
   - In your app settings, add custom domain
   - SSL certificate will be automatically provisioned

## 📊 Monitoring & Logs

### View Logs

```bash
# App Platform logs
doctl apps logs your-app-id --component backend
doctl apps logs your-app-id --component frontend

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks

- **Backend**: `https://your-backend.ondigitalocean.app/`
- **Frontend**: `https://your-frontend.ondigitalocean.app/`

## 🔒 Security Considerations

1. **Environment Variables:**

   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security:**

   - Use SSL connections
   - Restrict database access
   - Regular backups

3. **Application Security:**
   - Enable CORS properly
   - Use HTTPS everywhere
   - Implement rate limiting

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures:**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs in Digital Ocean dashboard

2. **Database Connection Issues:**

   - Verify `DATABASE_URL` format
   - Check database is accessible
   - Ensure SSL is properly configured

3. **Frontend Not Loading:**
   - Check `VITE_API_URL` is correct
   - Verify CORS settings in backend
   - Check browser console for errors

### Debug Commands

```bash
# Check app status
doctl apps list
doctl apps get your-app-id

# View app logs
doctl apps logs your-app-id --follow

# SSH into app (if using droplets)
doctl compute ssh your-droplet-id
```

## 💰 Cost Estimation

### Digital Ocean App Platform

- **Backend Service**: $5/month (Basic)
- **Frontend Static Site**: Free
- **Database**: $15/month (Basic)
- **Total**: ~$20/month

### Digital Ocean Droplet

- **Droplet**: $6/month (Basic)
- **Database**: $15/month (Basic)
- **Total**: ~$21/month

## 🎯 Next Steps

After successful deployment:

1. **Test All Features:**

   - User registration/login
   - Financial data entry
   - Analytics and reports
   - Contact form

2. **Set Up Monitoring:**

   - Configure alerts
   - Set up uptime monitoring
   - Monitor performance

3. **Backup Strategy:**

   - Regular database backups
   - Code repository backups
   - Environment variable backups

4. **Scaling:**
   - Monitor resource usage
   - Scale up as needed
   - Consider load balancing for high traffic

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Digital Ocean documentation
3. Check application logs
4. Create an issue in your GitHub repository

---

**Happy Deploying! 🚀**

Your Finance Flow application should now be live on Digital Ocean!
