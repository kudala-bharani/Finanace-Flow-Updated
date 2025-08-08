import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBudgetGoals() {
  try {
    console.log('🔍 Checking budget goals for Iron Man (user ID: 3)...');
    
    const budgetGoals = await prisma.budgetGoal.findMany({ 
      where: { userId: 3 },
      orderBy: [{ month: 'asc' }, { year: 'asc' }]
    });
    
    console.log(`Found ${budgetGoals.length} budget goals:`);
    budgetGoals.forEach(goal => {
      console.log(`- ${goal.category}: $${goal.amount} budget, $${goal.spent} spent (Month: ${goal.month}, Year: ${goal.year})`);
    });
    
    if (budgetGoals.length === 0) {
      console.log('❌ No budget goals found! Running seed script...');
      const { exec } = await import('child_process');
      exec('node seed-iron-man-data.js', (error, stdout, stderr) => {
        if (error) {
          console.error('Error running seed script:', error);
          return;
        }
        console.log('Seed script output:', stdout);
        if (stderr) console.error('Seed script errors:', stderr);
      });
    }
  } catch (error) {
    console.error('❌ Error checking budget goals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBudgetGoals(); 