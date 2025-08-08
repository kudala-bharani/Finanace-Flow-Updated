/*
  Warnings:

  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BudgetGoal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FriendTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetGoal" DROP CONSTRAINT "BudgetGoal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "FriendTransaction" DROP CONSTRAINT "FriendTransaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavingsGoal" DROP CONSTRAINT "SavingsGoal_userId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "BudgetGoal" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "FriendTransaction" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "SavingsGoal" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
