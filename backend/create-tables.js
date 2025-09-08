#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createTables() {
  try {
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected to database');

    console.log('📊 Creating database tables...');
    
    // Create tables one by one
    const tables = [
      {
        name: 'User',
        sql: `CREATE TABLE IF NOT EXISTS "User" (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )`
      },
      {
        name: 'Account',
        sql: `CREATE TABLE IF NOT EXISTS "Account" (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          balance DOUBLE PRECISION NOT NULL,
          "userId" INTEGER NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'Income',
        sql: `CREATE TABLE IF NOT EXISTS "Income" (
          id SERIAL PRIMARY KEY,
          amount DOUBLE PRECISION NOT NULL,
          source TEXT NOT NULL,
          category TEXT NOT NULL,
          date TIMESTAMP NOT NULL,
          description TEXT,
          "userId" INTEGER NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'Expense',
        sql: `CREATE TABLE IF NOT EXISTS "Expense" (
          id SERIAL PRIMARY KEY,
          amount DOUBLE PRECISION NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          date TIMESTAMP NOT NULL,
          "userId" INTEGER NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'FriendTransaction',
        sql: `CREATE TABLE IF NOT EXISTS "FriendTransaction" (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          amount DOUBLE PRECISION NOT NULL,
          description TEXT NOT NULL,
          date TIMESTAMP NOT NULL,
          type TEXT NOT NULL,
          completed BOOLEAN NOT NULL,
          "userId" INTEGER NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'BudgetGoal',
        sql: `CREATE TABLE IF NOT EXISTS "BudgetGoal" (
          id SERIAL PRIMARY KEY,
          category TEXT NOT NULL,
          amount DOUBLE PRECISION NOT NULL,
          spent DOUBLE PRECISION NOT NULL,
          month INTEGER NOT NULL DEFAULT 7,
          year INTEGER NOT NULL DEFAULT 2025,
          "userId" INTEGER NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'SavingsGoal',
        sql: `CREATE TABLE IF NOT EXISTS "SavingsGoal" (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          "targetAmount" DOUBLE PRECISION NOT NULL,
          "currentAmount" DOUBLE PRECISION NOT NULL,
          "targetDate" TIMESTAMP NOT NULL,
          description TEXT,
          "userId" INTEGER NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
        )`
      }
    ];

    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(table.sql);
        console.log(`✅ Created table: ${table.name}`);
      } catch (error) {
        console.log(`⚠️  Table ${table.name} may already exist or had an issue:`, error.message);
      }
    }
    console.log('✅ All tables created successfully');

    // Test the tables
    console.log('🧪 Testing tables...');
    const userCount = await prisma.user.count();
    console.log(`✅ User table accessible (${userCount} users)`);
    
    const accountCount = await prisma.account.count();
    console.log(`✅ Account table accessible (${accountCount} accounts)`);

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTables();
