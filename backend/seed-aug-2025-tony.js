import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAugustForTony() {
  try {
    console.log("🌟 Seeding August 2025 income and expenses for Tony Stark...");

    // Find Tony by email (case-insensitive)
    const tony = await prisma.user.findFirst({
      where: { email: { equals: "tony@stark.com", mode: "insensitive" } },
    });

    if (!tony) {
      console.log("❌ Tony Stark user not found (email: tony@stark.com)");
      return;
    }

    const userId = tony.id;

    // Clear any existing August 2025 entries to avoid duplicates
    const augStart = new Date("2025-08-01T00:00:00.000Z");
    const sepStart = new Date("2025-09-01T00:00:00.000Z");

    const [delInc, delExp] = await Promise.all([
      prisma.income.deleteMany({
        where: { userId, date: { gte: augStart, lt: sepStart } },
      }),
      prisma.expense.deleteMany({
        where: { userId, date: { gte: augStart, lt: sepStart } },
      }),
    ]);

    console.log(`🧹 Removed August incomes: ${delInc.count}, expenses: ${delExp.count}`);

    // Helper to create local Date in August 2025
    const d = (day) => new Date(`2025-08-${String(day).padStart(2, "0")}`);

    // Incomes
    const incomes = [
      {
        amount: 1800,
        source: "Stark Industries",
        category: "Salary",
        date: d(5),
        description: "Monthly salary",
      },
      {
        amount: 220,
        source: "Dividends",
        category: "Investment",
        date: d(15),
        description: "Stock dividends",
      },
      {
        amount: 200,
        source: "Consulting",
        category: "Freelance",
        date: d(24),
        description: "Ad-hoc consulting",
      },
    ];

    // Expenses
    const expenses = [
      { amount: 365, description: "Groceries", category: "Food & Dining", date: d(3) },
      { amount: 100, description: "Electricity Bill", category: "Utilities", date: d(8) },
      { amount: 50, description: "Internet", category: "Utilities", date: d(10) },
      { amount: 68, description: "Lunch Out", category: "Food & Dining", date: d(12) },
      { amount: 90, description: "Movie Night", category: "Entertainment", date: d(17) },
      { amount: 120, description: "Gas", category: "Transport", date: d(21) },
      { amount: 175, description: "Clothes Shopping", category: "Shopping", date: d(27) },
    ];

    // Insert data
    const createdIncomes = await Promise.all(
      incomes.map((income) => prisma.income.create({ data: { ...income, userId } }))
    );
    const createdExpenses = await Promise.all(
      expenses.map((expense) => prisma.expense.create({ data: { ...expense, userId } }))
    );

    console.log(`✅ Inserted ${createdIncomes.length} incomes and ${createdExpenses.length} expenses for August 2025.`);
  } catch (error) {
    console.error("❌ Error seeding August data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAugustForTony();
