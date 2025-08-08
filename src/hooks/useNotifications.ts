
import { useEffect } from 'react';
import { useFinanceData } from './useFinanceData';

export const useNotifications = () => {
  const { expenses, budgetGoals } = useFinanceData();

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const checkBudgetWarnings = () => {
    if (Notification.permission !== 'granted') return;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    budgetGoals.forEach(goal => {
      const categorySpent = monthlyExpenses
        .filter(expense => expense.category === goal.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      const percentage = (categorySpent / goal.amount) * 100;
      
      if (percentage >= 90 && percentage < 100) {
        new Notification(`Budget Alert: ${goal.category}`, {
          body: `You've spent ${percentage.toFixed(0)}% of your ${goal.category} budget`,
          icon: '/favicon.ico'
        });
      } else if (percentage >= 100) {
        new Notification(`Budget Exceeded: ${goal.category}`, {
          body: `You've exceeded your ${goal.category} budget by ${(percentage - 100).toFixed(0)}%`,
          icon: '/favicon.ico'
        });
      }
    });
  };

  return { checkBudgetWarnings };
};
