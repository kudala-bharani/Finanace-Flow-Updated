import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OLD_USER_ID = 3; // Old Iron Man account
const NEW_USER_ID = 5; // New Iron Man account

async function transferData() {
  try {
    console.log('🔄 Transferring data from old Iron Man account to new account...');
    
    // Transfer accounts
    const accounts = await prisma.account.findMany({ where: { userId: OLD_USER_ID } });
    for (const account of accounts) {
      await prisma.account.create({
        data: {
          name: account.name,
          type: account.type,
          balance: account.balance,
          userId: NEW_USER_ID
        }
      });
    }
    console.log(`✅ Transferred ${accounts.length} accounts`);

    // Transfer incomes
    const incomes = await prisma.income.findMany({ where: { userId: OLD_USER_ID } });
    for (const income of incomes) {
      await prisma.income.create({
        data: {
          amount: income.amount,
          source: income.source,
          category: income.category,
          date: income.date,
          description: income.description,
          userId: NEW_USER_ID
        }
      });
    }
    console.log(`✅ Transferred ${incomes.length} incomes`);

    // Transfer expenses
    const expenses = await prisma.expense.findMany({ where: { userId: OLD_USER_ID } });
    for (const expense of expenses) {
      await prisma.expense.create({
        data: {
          amount: expense.amount,
          description: expense.description,
          category: expense.category,
          date: expense.date,
          userId: NEW_USER_ID
        }
      });
    }
    console.log(`✅ Transferred ${expenses.length} expenses`);

    // Transfer friend transactions
    const friendTransactions = await prisma.friendTransaction.findMany({ where: { userId: OLD_USER_ID } });
    for (const tx of friendTransactions) {
      await prisma.friendTransaction.create({
        data: {
          name: tx.name,
          amount: tx.amount,
          description: tx.description,
          date: tx.date,
          type: tx.type,
          completed: tx.completed,
          userId: NEW_USER_ID
        }
      });
    }
    console.log(`✅ Transferred ${friendTransactions.length} friend transactions`);

    // Transfer budget goals
    const budgetGoals = await prisma.budgetGoal.findMany({ where: { userId: OLD_USER_ID } });
    for (const goal of budgetGoals) {
      await prisma.budgetGoal.create({
        data: {
          category: goal.category,
          amount: goal.amount,
          spent: goal.spent,
          month: goal.month,
          year: goal.year,
          userId: NEW_USER_ID
        }
      });
    }
    console.log(`✅ Transferred ${budgetGoals.length} budget goals`);

    // Transfer savings goals
    const savingsGoals = await prisma.savingsGoal.findMany({ where: { userId: OLD_USER_ID } });
    for (const goal of savingsGoals) {
      await prisma.savingsGoal.create({
        data: {
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate,
          description: goal.description,
          userId: NEW_USER_ID
        }
      });
    }
    console.log(`✅ Transferred ${savingsGoals.length} savings goals`);

    console.log('🎉 Data transfer completed successfully!');
    console.log('You can now login with:');
    console.log('Email: iron@gmail.com');
    console.log('Password: (whatever password you set during signup)');

  } catch (error) {
    console.error('❌ Error transferring data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

transferData(); 