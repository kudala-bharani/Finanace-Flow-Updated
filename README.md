# 💰 Finance Flow

A modern, full-stack personal finance management application built with React, TypeScript, and Node.js. Track your income, expenses, budget goals, and savings with an intuitive and beautiful interface.

![Finance Flow Dashboard](public/screenshots/dashboard/Screenshot%202025-07-13%20012510.png)

## ✨ Features

### 📊 Dashboard & Analytics

- **Real-time Overview**: Get instant insights into your financial health
- **Interactive Charts**: Visualize spending patterns and income trends
- **Smart Analytics**: AI-powered financial insights and recommendations
- **Customizable Widgets**: Arrange your dashboard to match your preferences

### 💳 Account Management

- **Multi-Account Support**: Manage checking, savings, credit cards, and cash
- **Balance Tracking**: Real-time balance updates across all accounts
- **Account Categories**: Organize accounts by type and purpose
- **Transaction History**: Detailed logs of all financial activities

### 💸 Expense Tracking

- **Smart Categorization**: Automatic expense categorization
- **Receipt Upload**: Store and organize digital receipts
- **Recurring Expenses**: Set up automatic recurring expense tracking
- **Expense Analytics**: Detailed breakdown of spending patterns

### 💰 Income Management

- **Multiple Income Sources**: Track salary, freelance, investments, and more
- **Income Categories**: Organize different types of income
- **Income Trends**: Analyze income patterns over time
- **Tax Preparation**: Export income data for tax purposes

### 🎯 Budget Goals

- **Smart Budgeting**: Set realistic budget goals by category
- **Progress Tracking**: Visual progress indicators for each goal
- **Monthly/Yearly Goals**: Flexible time-based budgeting
- **Overspending Alerts**: Get notified when approaching budget limits

### 🏦 Savings Goals

- **Goal Setting**: Create and track multiple savings goals
- **Progress Visualization**: See your progress towards each goal
- **Target Dates**: Set deadlines for achieving your goals
- **Motivational Tracking**: Celebrate milestones along the way

### 👥 Friend Transactions

- **Split Expenses**: Easily split bills with friends and family
- **IOU Tracking**: Keep track of money owed and owed to you
- **Payment Status**: Mark transactions as completed
- **Friend Management**: Organize transactions by person

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Recharts** - Data visualization
- **ApexCharts** - Advanced charting

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Reliable relational database
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Vite** - Development server

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation Guide

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Finanace-Flow-main
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Set Up PostgreSQL Database

#### On Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

#### On macOS (using Homebrew):

```bash
brew install postgresql
brew services start postgresql
```

#### On Windows:

Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/windows/)

### 5. Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE financeflow;
CREATE USER financeflow WITH PASSWORD 'financeflow123';
GRANT ALL PRIVILEGES ON DATABASE financeflow TO financeflow;
GRANT ALL ON SCHEMA public TO financeflow;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO financeflow;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO financeflow;

# Exit PostgreSQL
\q
```

### 6. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
echo 'DATABASE_URL="postgresql://financeflow:financeflow123@localhost:5432/financeflow"' > .env
echo 'JWT_SECRET="your-super-secret-jwt-key-change-in-production"' >> .env
echo 'CONTACT_EMAIL_USER="your-email@gmail.com"' >> .env
echo 'CONTACT_EMAIL_PASS="your-app-password"' >> .env
```

### 7. Set Up Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 8. Seed Sample Data (Optional)

```bash
# Create a sample user and populate with data
node seed-iron-man-data.js
```

## 🏃‍♂️ Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will be available at `http://localhost:4000`

### Start the Frontend Development Server

```bash
# In a new terminal, from the project root
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the next available port like 8080, 8081, 8082, etc.)

## 👤 Sample Login Credentials

For testing purposes, you can use these sample credentials:

- **Email**: `tony@stark.com`
- **Password**: `password123`

> **Note**: This account comes with 6 months of sample financial data including:
>
> - 11 different accounts (checking, savings, credit cards, cash)
> - 31 expense entries across various categories
> - 13 income entries from multiple sources
> - Budget goals and savings goals
> - Friend transactions

## 📱 Usage

### Getting Started

1. **Sign Up/Login**: Create a new account or log in with existing credentials
2. **Add Accounts**: Set up your bank accounts, credit cards, and cash accounts
3. **Track Income**: Record your income sources and amounts
4. **Log Expenses**: Add your daily expenses with categories
5. **Set Budget Goals**: Create monthly budget targets for different categories
6. **Create Savings Goals**: Set financial goals with target amounts and dates
7. **Manage Friends**: Track money owed to and from friends

### Key Features

- **Dashboard**: Get an overview of your financial health
- **Analytics**: View detailed charts and insights
- **Accounts**: Manage all your financial accounts
- **Expenses**: Track and categorize your spending
- **Income**: Record and analyze your income sources
- **Budget Goals**: Set and monitor budget targets
- **Savings Goals**: Track progress towards financial goals
- **Friends**: Manage shared expenses and IOUs

## 🏗️ Project Structure

```
Finanace-Flow-main/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API
│   └── ui/                # shadcn/ui components
├── backend/               # Backend source code
│   ├── prisma/            # Database schema and migrations
│   ├── index.mjs          # Main server file
│   └── seed-iron-man-data.js  # Sample data seeder
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🔧 Development

### Available Scripts

#### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend

- `npm run dev` - Start development server

### Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

## 🚀 Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

### Backend Deployment

The backend can be deployed to various platforms:

1. **Heroku**:

   ```bash
   heroku create
   heroku addons:create heroku-postgresql
   git push heroku main
   ```

2. **Railway**:

   - Connect your GitHub repository
   - Add PostgreSQL database
   - Deploy automatically

3. **DigitalOcean App Platform**:
   - Connect your repository
   - Configure environment variables
   - Deploy with one click

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/Finanace-Flow/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io/) for database management
- [Vite](https://vitejs.dev/) for fast development

---

**Made with ❤️ for better financial management**
