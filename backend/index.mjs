import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Test database connection and run migrations if needed
async function initializeDatabase() {
  try {
    console.log("🔌 Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    
    // Try to sync database schema
    console.log("📊 Syncing database schema...");
    const { execSync } = await import('child_process');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log("✅ Database schema synced");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    // Don't exit - let the server start anyway
  }
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  // Convert email to lowercase for case-insensitive comparison
  const emailLower = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: emailLower },
  });
  if (existing)
    return res.status(409).json({ error: "Email already registered" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: emailLower, password: hashed },
  });
  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields required" });

  // Convert email to lowercase for case-insensitive comparison
  const emailLower = email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: emailLower } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Contact form endpoint
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Configure transporter (use your real credentials in production)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL_USER, // e.g. your Gmail address
      pass: process.env.CONTACT_EMAIL_PASS, // app password or real password
    },
  });

  try {
    await transporter.sendMail({
      from: `FinanceFlow Contact <${process.env.CONTACT_EMAIL_USER}>`,
      to: "bunnykudala@gmail.com",
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message.replace(
        /\n/g,
        "<br/>"
      )}</p>`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// All routes below require authentication
// ACCOUNTS CRUD
app.get("/accounts", authenticateToken, async (req, res) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.user.userId },
  });
  res.json(accounts);
});
app.get("/accounts/:id", authenticateToken, async (req, res) => {
  const account = await prisma.account.findUnique({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json(account);
});
app.post("/accounts", authenticateToken, async (req, res) => {
  try {
    const account = await prisma.account.create({
      data: { ...req.body, userId: req.user.userId },
    });
    res.json(account);
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(400).json({ error: error.message, details: error });
  }
});
app.put("/accounts/:id", authenticateToken, async (req, res) => {
  const account = await prisma.account.update({
    where: { id: Number(req.params.id), userId: req.user.userId },
    data: req.body,
  });
  res.json(account);
});
app.delete("/accounts/:id", authenticateToken, async (req, res) => {
  await prisma.account.delete({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json({ success: true });
});

// INCOMES CRUD
app.get("/incomes", authenticateToken, async (req, res) => {
  const incomes = await prisma.income.findMany({
    where: { userId: req.user.userId },
  });
  res.json(incomes);
});
app.get("/incomes/:id", authenticateToken, async (req, res) => {
  const income = await prisma.income.findUnique({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json(income);
});
app.post("/incomes", authenticateToken, async (req, res) => {
  const income = await prisma.income.create({
    data: { ...req.body, userId: req.user.userId },
  });
  res.json(income);
});
app.put("/incomes/:id", authenticateToken, async (req, res) => {
  const income = await prisma.income.update({
    where: { id: Number(req.params.id), userId: req.user.userId },
    data: req.body,
  });
  res.json(income);
});
app.delete("/incomes/:id", authenticateToken, async (req, res) => {
  await prisma.income.delete({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json({ success: true });
});

// EXPENSES CRUD
app.get("/expenses", authenticateToken, async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { userId: req.user.userId },
  });
  res.json(expenses);
});
app.get("/expenses/:id", authenticateToken, async (req, res) => {
  const expense = await prisma.expense.findUnique({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json(expense);
});
app.post("/expenses", authenticateToken, async (req, res) => {
  const expense = await prisma.expense.create({
    data: { ...req.body, userId: req.user.userId },
  });
  res.json(expense);
});
app.put("/expenses/:id", authenticateToken, async (req, res) => {
  const expense = await prisma.expense.update({
    where: { id: Number(req.params.id), userId: req.user.userId },
    data: req.body,
  });
  res.json(expense);
});
app.delete("/expenses/:id", authenticateToken, async (req, res) => {
  await prisma.expense.delete({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json({ success: true });
});

// FRIEND TRANSACTIONS CRUD
app.get("/friend-transactions", authenticateToken, async (req, res) => {
  const txs = await prisma.friendTransaction.findMany({
    where: { userId: req.user.userId },
  });
  res.json(txs);
});
app.get("/friend-transactions/:id", authenticateToken, async (req, res) => {
  const tx = await prisma.friendTransaction.findUnique({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json(tx);
});
app.post("/friend-transactions", authenticateToken, async (req, res) => {
  const tx = await prisma.friendTransaction.create({
    data: { ...req.body, userId: req.user.userId },
  });
  res.json(tx);
});
app.put("/friend-transactions/:id", authenticateToken, async (req, res) => {
  const tx = await prisma.friendTransaction.update({
    where: { id: Number(req.params.id), userId: req.user.userId },
    data: req.body,
  });
  res.json(tx);
});
app.delete("/friend-transactions/:id", authenticateToken, async (req, res) => {
  await prisma.friendTransaction.delete({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json({ success: true });
});

// BUDGET GOALS CRUD
app.get("/budget-goals", authenticateToken, async (req, res) => {
  const goals = await prisma.budgetGoal.findMany({
    where: { userId: req.user.userId },
  });
  res.json(goals);
});
app.get("/budget-goals/:id", authenticateToken, async (req, res) => {
  const goal = await prisma.budgetGoal.findUnique({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json(goal);
});
app.post("/budget-goals", authenticateToken, async (req, res) => {
  const goal = await prisma.budgetGoal.create({
    data: { ...req.body, userId: req.user.userId },
  });
  res.json(goal);
});
app.put("/budget-goals/:id", authenticateToken, async (req, res) => {
  const goal = await prisma.budgetGoal.update({
    where: { id: Number(req.params.id), userId: req.user.userId },
    data: req.body,
  });
  res.json(goal);
});
app.delete("/budget-goals/:id", authenticateToken, async (req, res) => {
  await prisma.budgetGoal.delete({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json({ success: true });
});

// SAVINGS GOALS CRUD
app.get("/savings-goals", authenticateToken, async (req, res) => {
  const goals = await prisma.savingsGoal.findMany({
    where: { userId: req.user.userId },
  });
  res.json(goals);
});
app.get("/savings-goals/:id", authenticateToken, async (req, res) => {
  const goal = await prisma.savingsGoal.findUnique({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json(goal);
});
app.post("/savings-goals", authenticateToken, async (req, res) => {
  const goal = await prisma.savingsGoal.create({
    data: { ...req.body, userId: req.user.userId },
  });
  res.json(goal);
});
app.put("/savings-goals/:id", authenticateToken, async (req, res) => {
  const goal = await prisma.savingsGoal.update({
    where: { id: Number(req.params.id), userId: req.user.userId },
    data: req.body,
  });
  res.json(goal);
});
app.delete("/savings-goals/:id", authenticateToken, async (req, res) => {
  await prisma.savingsGoal.delete({
    where: { id: Number(req.params.id), userId: req.user.userId },
  });
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;

async function startServer() {
  console.log(`Starting server on port ${PORT}...`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Database URL configured: ${process.env.DATABASE_URL ? "Yes" : "No"}`
  );

  // Initialize database
  await initializeDatabase();

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Backend API server running on port ${PORT}`);
    console.log(`✅ Server is ready to accept connections`);
  });

  server.on("error", (error) => {
    console.error("❌ Server error:", error);
    process.exit(1);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  });

  process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });
}

// Start the server
startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
