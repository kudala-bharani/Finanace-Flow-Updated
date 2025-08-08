import { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Education',
  'Other',
];

export function useExpenseCategories() {
  const [categories, setCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem('expenseCategories');
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('expenseCategories', JSON.stringify(categories));
  }, [categories]);

  return [categories, setCategories] as const;
} 