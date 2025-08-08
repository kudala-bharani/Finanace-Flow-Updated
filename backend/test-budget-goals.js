import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBudgetGoals() {
  try {
    console.log('🔍 Testing budget goals API response...');
    
    // Test direct database query
    const dbGoals = await prisma.budgetGoal.findMany({ 
      where: { userId: 3 },
      take: 3
    });
    
    console.log('Database query result (first 3):');
    dbGoals.forEach((goal, i) => {
      console.log(`${i + 1}. ${goal.category}: month=${goal.month}, year=${goal.year}, amount=${goal.amount}`);
    });
    
    // Test if the API endpoint would return the same
    console.log('\n🔍 Checking if month/year fields are included in API response...');
    
    const allGoals = await prisma.budgetGoal.findMany({ 
      where: { userId: 3 }
    });
    
    console.log(`Total goals in DB: ${allGoals.length}`);
    console.log('Sample goal from DB:', allGoals[0]);
    
    // Check if any goals have month/year
    const goalsWithMonthYear = allGoals.filter(g => g.month !== null && g.year !== null);
    console.log(`Goals with month/year: ${goalsWithMonthYear.length}`);
    
    if (goalsWithMonthYear.length === 0) {
      console.log('❌ No goals have month/year fields! Running seed script...');
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
    console.error('❌ Error testing budget goals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBudgetGoals(); 