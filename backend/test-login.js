import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing login functionality...');
    
    // Test with Iron Man user
    const testEmail = 'IronMan@gmail.com';
    const testPassword = 'password'; // assuming this is the password
    
    console.log(`Testing login with email: "${testEmail}"`);
    
    // Find user by email (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: testEmail,
          mode: 'insensitive'
        }
      }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordLength: user.password.length
    });
    
    // Test password verification
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`Password verification result: ${isValid}`);
    
    if (!isValid) {
      console.log('❌ Password is incorrect or not properly hashed');
      console.log('Creating a new password for Iron Man...');
      
      // Update Iron Man's password
      const hashedPassword = await bcrypt.hash('password', 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      
      console.log('✅ Updated Iron Man password to "password"');
      console.log('You can now login with:');
      console.log('Email: IronMan@gmail.com (or ironman@gmail.com)');
      console.log('Password: password');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 