import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IRON_MAN_USER_ID = 1;

const generateSampleData = () => {
  // Helper function for dates
  const date = (month, day) =>
    new Date(
      `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    );

  return {
    accounts: [
      { name: "Bank of America Checking", type: "Bank Account", balance: 3200 },
      { name: "HDFC Savings", type: "Bank Account", balance: 5400 },
      { name: "Chase Freedom Credit Card", type: "Credit Card", balance: -250 },
      { name: "Amex Platinum", type: "Credit Card", balance: -1200 },
      { name: "", type: "Cash", balance: 180 },
      { name: "", type: "Cash", balance: 60 },
      { name: "", type: "Coins", balance: 12.5 },
      { name: "", type: "Coins", balance: 3.75 },
      { name: "Personal Savings", type: "Savings", balance: 12000 },
      { name: "Daily Expenses", type: "Checking", balance: 2500 },
      { name: "Investment", type: "Investment", balance: 8000 },
    ],
    incomes: [
      // February 2025
      {
        amount: 1800,
        source: "Stark Industries",
        category: "Salary",
        date: date(2, 5),
        description: "Monthly salary",
      },
      {
        amount: 200,
        source: "Dividends",
        category: "Investment",
        date: date(2, 15),
        description: "Stock dividends",
      },

      // March 2025
      {
        amount: 1800,
        source: "Stark Industries",
        category: "Salary",
        date: date(3, 5),
        description: "Monthly salary",
      },
      {
        amount: 150,
        source: "Consulting",
        category: "Freelance",
        date: date(3, 20),
        description: "Consulting fee",
      },

      // April 2025
      {
        amount: 1800,
        source: "Stark Industries",
        category: "Salary",
        date: date(4, 5),
        description: "Monthly salary",
      },
      {
        amount: 250,
        source: "Dividends",
        category: "Investment",
        date: date(4, 15),
        description: "Stock dividends",
      },

      // May 2025
      {
        amount: 1800,
        source: "Stark Industries",
        category: "Salary",
        date: date(5, 5),
        description: "Monthly salary",
      },
      {
        amount: 100,
        source: "Speaking",
        category: "Freelance",
        date: date(5, 25),
        description: "Conference speaking",
      },

      // June 2025
      {
        amount: 1800,
        source: "Stark Industries",
        category: "Salary",
        date: date(6, 5),
        description: "Monthly salary",
      },
      {
        amount: 300,
        source: "Bonus",
        category: "Salary",
        date: date(6, 20),
        description: "Performance bonus",
      },

      // July 2025
      {
        amount: 1800,
        source: "Stark Industries",
        category: "Salary",
        date: date(7, 5),
        description: "Monthly salary",
      },
      {
        amount: 200,
        source: "Dividends",
        category: "Investment",
        date: date(7, 15),
        description: "Stock dividends",
      },
      {
        amount: 150,
        source: "Consulting",
        category: "Freelance",
        date: date(7, 25),
        description: "Consulting fee",
      },
    ],
    expenses: [
      // February 2025
      {
        amount: 350,
        description: "Groceries",
        category: "Food & Dining",
        date: date(2, 3),
      },
      {
        amount: 100,
        description: "Electricity Bill",
        category: "Utilities",
        date: date(2, 8),
      },
      {
        amount: 50,
        description: "Internet",
        category: "Utilities",
        date: date(2, 10),
      },
      {
        amount: 80,
        description: "Movie Night",
        category: "Entertainment",
        date: date(2, 14),
      },
      {
        amount: 120,
        description: "Clothes Shopping",
        category: "Shopping",
        date: date(2, 20),
      },

      // March 2025
      {
        amount: 320,
        description: "Groceries",
        category: "Food & Dining",
        date: date(3, 5),
      },
      {
        amount: 100,
        description: "Electricity Bill",
        category: "Utilities",
        date: date(3, 8),
      },
      {
        amount: 50,
        description: "Internet",
        category: "Utilities",
        date: date(3, 10),
      },
      {
        amount: 60,
        description: "Coffee with friend",
        category: "Food & Dining",
        date: date(3, 15),
      },
      {
        amount: 90,
        description: "Taxi",
        category: "Transport",
        date: date(3, 22),
      },

      // April 2025
      {
        amount: 380,
        description: "Groceries",
        category: "Food & Dining",
        date: date(4, 2),
      },
      {
        amount: 100,
        description: "Electricity Bill",
        category: "Utilities",
        date: date(4, 8),
      },
      {
        amount: 50,
        description: "Internet",
        category: "Utilities",
        date: date(4, 10),
      },
      {
        amount: 70,
        description: "Restaurant Dinner",
        category: "Food & Dining",
        date: date(4, 18),
      },
      {
        amount: 150,
        description: "Books",
        category: "Shopping",
        date: date(4, 25),
      },

      // May 2025
      {
        amount: 340,
        description: "Groceries",
        category: "Food & Dining",
        date: date(5, 4),
      },
      {
        amount: 100,
        description: "Electricity Bill",
        category: "Utilities",
        date: date(5, 8),
      },
      {
        amount: 50,
        description: "Internet",
        category: "Utilities",
        date: date(5, 10),
      },
      {
        amount: 85,
        description: "Movie Tickets",
        category: "Entertainment",
        date: date(5, 16),
      },
      {
        amount: 110,
        description: "Gas",
        category: "Transport",
        date: date(5, 28),
      },

      // June 2025
      {
        amount: 360,
        description: "Groceries",
        category: "Food & Dining",
        date: date(6, 6),
      },
      {
        amount: 100,
        description: "Electricity Bill",
        category: "Utilities",
        date: date(6, 8),
      },
      {
        amount: 50,
        description: "Internet",
        category: "Utilities",
        date: date(6, 10),
      },
      {
        amount: 75,
        description: "Coffee Shop",
        category: "Food & Dining",
        date: date(6, 18),
      },
      {
        amount: 130,
        description: "Electronics",
        category: "Shopping",
        date: date(6, 25),
      },

      // July 2025
      {
        amount: 370,
        description: "Groceries",
        category: "Food & Dining",
        date: date(7, 4),
      },
      {
        amount: 100,
        description: "Electricity Bill",
        category: "Utilities",
        date: date(7, 8),
      },
      {
        amount: 50,
        description: "Internet",
        category: "Utilities",
        date: date(7, 10),
      },
      {
        amount: 65,
        description: "Lunch Out",
        category: "Food & Dining",
        date: date(7, 12),
      },
      {
        amount: 95,
        description: "Movie Night",
        category: "Entertainment",
        date: date(7, 19),
      },
      {
        amount: 80,
        description: "Taxi",
        category: "Transport",
        date: date(7, 26),
      },
    ],
    friendTransactions: [
      // February 2025
      {
        name: "Pepper",
        amount: 45,
        description: "Dinner split",
        date: date(2, 14),
        type: "give",
        completed: false,
      },
      {
        name: "Rhodey",
        amount: 30,
        description: "Movie tickets",
        date: date(2, 20),
        type: "receive",
        completed: false,
      },

      // March 2025
      {
        name: "Bruce",
        amount: 25,
        description: "Coffee share",
        date: date(3, 15),
        type: "give",
        completed: false,
      },
      {
        name: "Happy",
        amount: 40,
        description: "Lunch split",
        date: date(3, 25),
        type: "receive",
        completed: false,
      },

      // April 2025
      {
        name: "Natasha",
        amount: 35,
        description: "Gas money",
        date: date(4, 10),
        type: "give",
        completed: false,
      },
      {
        name: "Peter",
        amount: 20,
        description: "Snack share",
        date: date(4, 22),
        type: "receive",
        completed: false,
      },

      // May 2025
      {
        name: "Pepper",
        amount: 50,
        description: "Restaurant bill",
        date: date(5, 16),
        type: "give",
        completed: false,
      },
      {
        name: "Rhodey",
        amount: 30,
        description: "Parking fee",
        date: date(5, 28),
        type: "receive",
        completed: false,
      },

      // June 2025
      {
        name: "Bruce",
        amount: 35,
        description: "Coffee treat",
        date: date(6, 18),
        type: "give",
        completed: false,
      },
      {
        name: "Happy",
        amount: 40,
        description: "Movie tickets",
        date: date(6, 25),
        type: "receive",
        completed: false,
      },

      // July 2025
      {
        name: "Natasha",
        amount: 25,
        description: "Lunch split",
        date: date(7, 12),
        type: "give",
        completed: false,
      },
      {
        name: "Peter",
        amount: 30,
        description: "Taxi share",
        date: date(7, 26),
        type: "receive",
        completed: false,
      },
    ],
    budgetGoals: [
      // Current month (July 2025) budget goals
      {
        category: "Food & Dining",
        amount: 400,
        spent: 435,
        month: 7,
        year: 2025,
      },
      { category: "Utilities", amount: 200, spent: 150, month: 7, year: 2025 },
      {
        category: "Entertainment",
        amount: 150,
        spent: 95,
        month: 7,
        year: 2025,
      },
      { category: "Transport", amount: 100, spent: 80, month: 7, year: 2025 },
      { category: "Shopping", amount: 200, spent: 0, month: 7, year: 2025 },
      { category: "Healthcare", amount: 150, spent: 0, month: 7, year: 2025 },
      { category: "Education", amount: 100, spent: 0, month: 7, year: 2025 },

      // Previous month (June 2025) budget goals
      {
        category: "Food & Dining",
        amount: 400,
        spent: 435,
        month: 6,
        year: 2025,
      },
      { category: "Utilities", amount: 200, spent: 150, month: 6, year: 2025 },
      {
        category: "Entertainment",
        amount: 150,
        spent: 0,
        month: 6,
        year: 2025,
      },
      { category: "Transport", amount: 100, spent: 0, month: 6, year: 2025 },
      { category: "Shopping", amount: 200, spent: 130, month: 6, year: 2025 },
      { category: "Healthcare", amount: 150, spent: 75, month: 6, year: 2025 },
      { category: "Education", amount: 100, spent: 50, month: 6, year: 2025 },

      // May 2025 budget goals (for testing)
      {
        category: "Food & Dining",
        amount: 400,
        spent: 380,
        month: 5,
        year: 2025,
      },
      { category: "Utilities", amount: 200, spent: 150, month: 5, year: 2025 },
      {
        category: "Entertainment",
        amount: 150,
        spent: 85,
        month: 5,
        year: 2025,
      },
      { category: "Transport", amount: 100, spent: 110, month: 5, year: 2025 },
      { category: "Shopping", amount: 200, spent: 180, month: 5, year: 2025 },
    ],
    savingsGoals: [
      {
        name: "Vacation Fund",
        targetAmount: 2000,
        currentAmount: 1200,
        targetDate: new Date("2025-12-31"),
        description: "Trip to Europe",
      },
      {
        name: "Emergency Fund",
        targetAmount: 3000,
        currentAmount: 1500,
        targetDate: new Date("2025-10-31"),
        description: "For unexpected expenses",
      },
      {
        name: "New Gadgets",
        targetAmount: 800,
        currentAmount: 400,
        targetDate: new Date("2025-09-30"),
        description: "Latest tech gadgets",
      },
    ],
  };
};

async function seedIronManData() {
  try {
    console.log("🌟 Seeding Iron Man data for 6 months (Feb-July 2025)...");
    const sampleData = generateSampleData();

    // Clean up previous data for this user
    await prisma.account.deleteMany({ where: { userId: IRON_MAN_USER_ID } });
    await prisma.income.deleteMany({ where: { userId: IRON_MAN_USER_ID } });
    await prisma.expense.deleteMany({ where: { userId: IRON_MAN_USER_ID } });
    await prisma.friendTransaction.deleteMany({
      where: { userId: IRON_MAN_USER_ID },
    });
    await prisma.budgetGoal.deleteMany({ where: { userId: IRON_MAN_USER_ID } });
    await prisma.savingsGoal.deleteMany({
      where: { userId: IRON_MAN_USER_ID },
    });

    // Add accounts
    for (const account of sampleData.accounts) {
      await prisma.account.create({
        data: { ...account, userId: IRON_MAN_USER_ID },
      });
    }
    // Add incomes
    for (const income of sampleData.incomes) {
      await prisma.income.create({
        data: { ...income, userId: IRON_MAN_USER_ID },
      });
    }
    // Add expenses
    for (const expense of sampleData.expenses) {
      await prisma.expense.create({
        data: { ...expense, userId: IRON_MAN_USER_ID },
      });
    }
    // Add friend transactions
    for (const transaction of sampleData.friendTransactions) {
      await prisma.friendTransaction.create({
        data: { ...transaction, userId: IRON_MAN_USER_ID },
      });
    }
    // Add budget goals
    for (const goal of sampleData.budgetGoals) {
      await prisma.budgetGoal.create({
        data: { ...goal, userId: IRON_MAN_USER_ID },
      });
    }
    // Add savings goals
    for (const goal of sampleData.savingsGoals) {
      await prisma.savingsGoal.create({
        data: { ...goal, userId: IRON_MAN_USER_ID },
      });
    }
    console.log("✅ Done! 6 months of data added with realistic amounts.");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedIronManData();
