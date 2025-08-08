import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    const users = await prisma.user.findMany();
    
    console.log(`Found ${users.length} users:`);
    users.forEach((user, i) => {
      console.log(`${i + 1}. ID: ${user.id}, Name: ${user.name}, Email: "${user.email}"`);
    });
    
    if (users.length === 0) {
      console.log('❌ No users found! Creating a test user...');
      
      // Create a test user
      const testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: password
        }
      });
      
      console.log('✅ Created test user:', testUser);
      console.log('You can now login with:');
      console.log('Email: test@example.com');
      console.log('Password: password');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 