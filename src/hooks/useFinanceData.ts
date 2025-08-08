import { useState, useEffect } from 'react';
import {
  getAccounts, createAccount, updateAccount, deleteAccount,
  getIncomes, createIncome, updateIncome, deleteIncome,
  getExpenses, createExpense, updateExpense, deleteExpense,
  getFriendTransactions, createFriendTransaction, updateFriendTransaction, deleteFriendTransaction,
  getBudgetGoals, createBudgetGoal, updateBudgetGoal, deleteBudgetGoal,
  getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal
} from '../lib/api';
import { useToast } from '@/hooks/use-toast';

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  category: string;
  date: string;
  description?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface FriendTransaction {
  id: string;
  name: string;
  amount: number;
  description: string;
  date: string;
  type: 'receive' | 'give';
  completed: boolean;
}

export interface BudgetGoal {
  id?: string;
  category: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
}

const useFinanceData = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [friendTransactions, setFriendTransactions] = useState<FriendTransaction[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [budgetGoalsLoading, setBudgetGoalsLoading] = useState(true);
  const { toast } = useToast();

  // Load data from backend on mount (all types)
  useEffect(() => {
    getAccounts().then(setAccounts).catch((error) => console.error('Error loading accounts:', error));
    getIncomes().then(setIncomes).catch((error) => console.error('Error loading incomes:', error));
    getExpenses().then((data) => { console.log('[useFinanceData] getExpenses:', data); setExpenses(data); setExpensesLoading(false); }).catch((error) => { console.error('Error loading expenses:', error); setExpensesLoading(false); });
    getFriendTransactions().then(setFriendTransactions).catch((error) => console.error('Error loading friend tx:', error));
    getBudgetGoals().then((data) => { console.log('[useFinanceData] getBudgetGoals:', data); setBudgetGoals(data); setBudgetGoalsLoading(false); }).catch((error) => { console.error('Error loading budget goals:', error); setBudgetGoalsLoading(false); });
    // Add similar for savings goals if needed
  }, []);

  // Remove all localStorage useEffects for these types

  // CRUD helpers for accounts
  const addAccount = async (account: Omit<Account, 'id'>) => {
    try {
      const newAccount = await createAccount(account);
      setAccounts((prev) => [...prev, newAccount]);
    } catch (error) {
      console.error('Error creating account:', error);
      toast({ title: 'Failed to create account', description: error.message, variant: 'destructive' });
    }
  };
  const editAccount = async (id: string, account: Partial<Account>) => {
    const updated = await updateAccount(id, account);
    setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };
  const removeAccount = async (id: string) => {
    await deleteAccount(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // CRUD helpers for incomes
  const addIncome = async (income) => {
    try {
      const newIncome = await createIncome(income);
      setIncomes((prev) => [...prev, newIncome]);
    } catch (error) {
      console.error('Error creating income:', error);
      toast({ title: 'Failed to create income', description: error.message, variant: 'destructive' });
    }
  };
  const editIncome = async (id, income) => {
    const updated = await updateIncome(id, income);
    setIncomes((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };
  const removeIncome = async (id) => {
    await deleteIncome(id);
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  // CRUD helpers for expenses
  const addExpense = async (expense) => {
    try {
      await createExpense(expense);
      setExpensesLoading(true);
      const fresh = await getExpenses();
      console.log('[useFinanceData] addExpense -> getExpenses:', fresh);
      setExpenses(fresh);
      setExpensesLoading(false);
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({ title: 'Failed to create expense', description: error.message, variant: 'destructive' });
      setExpensesLoading(false);
    }
  };
  const editExpense = async (id, expense) => {
    await updateExpense(id, expense);
    const fresh = await getExpenses();
    setExpenses(fresh);
  };
  const removeExpense = async (id) => {
    await deleteExpense(id);
    const fresh = await getExpenses();
    setExpenses(fresh);
  };

  // CRUD helpers for friend transactions
  const addFriendTransaction = async (tx) => {
    try {
      const newTx = await createFriendTransaction(tx);
      setFriendTransactions((prev) => [...prev, newTx]);
    } catch (error) {
      console.error('Error creating friend transaction:', error);
      toast({ title: 'Failed to create friend transaction', description: error.message, variant: 'destructive' });
    }
  };
  const editFriendTransaction = async (id, tx) => {
    const updated = await updateFriendTransaction(id, tx);
    setFriendTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };
  const removeFriendTransaction = async (id) => {
    await deleteFriendTransaction(id);
    setFriendTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // CRUD helpers for budget goals
  const addBudgetGoal = async (goal) => {
    try {
      const newGoal = await createBudgetGoal(goal);
      setBudgetGoals((prev) => [...prev, newGoal]);
    } catch (error) {
      console.error('Error creating budget goal:', error);
      toast({ title: 'Failed to create budget goal', description: error.message, variant: 'destructive' });
    }
  };
  const editBudgetGoal = async (id, goal) => {
    const updated = await updateBudgetGoal(id, goal);
    setBudgetGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  };
  const removeBudgetGoal = async (id) => {
    await deleteBudgetGoal(id);
    setBudgetGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // CRUD helpers for savings goals
  const [savingsGoals, setSavingsGoals] = useState([]);
  useEffect(() => {
    getSavingsGoals().then(setSavingsGoals).catch((error) => console.error('Error loading savings goals:', error));
  }, []);
  const addSavingsGoal = async (goal) => {
    try {
      await createSavingsGoal(goal);
      const fresh = await getSavingsGoals();
      setSavingsGoals(fresh);
    } catch (error) {
      console.error('Error creating savings goal:', error);
      toast({ title: 'Failed to create savings goal', description: error.message, variant: 'destructive' });
    }
  };
  const editSavingsGoal = async (id, goal) => {
    await updateSavingsGoal(id, goal);
    const fresh = await getSavingsGoals();
    setSavingsGoals(fresh);
  };
  const removeSavingsGoal = async (id) => {
    await deleteSavingsGoal(id);
    const fresh = await getSavingsGoals();
    setSavingsGoals(fresh);
  };

  // Export data functionality
  const exportData = () => {
    const data = {
      accounts,
      incomes,
      expenses,
      friendTransactions,
      budgetGoals,
      savingsGoals, // Include savings goals in export
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data functionality
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.accounts) setAccounts(data.accounts);
        if (data.incomes) setIncomes(data.incomes);
        if (data.expenses) setExpenses(data.expenses);
        if (data.friendTransactions) setFriendTransactions(data.friendTransactions);
        if (data.budgetGoals) setBudgetGoals(data.budgetGoals);
        if (data.savingsGoals) setSavingsGoals(data.savingsGoals); // Import savings goals
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  return {
    accounts,
    setAccounts, addAccount, editAccount, removeAccount,
    incomes, setIncomes, addIncome, editIncome, removeIncome,
    expenses, setExpenses, addExpense, editExpense, removeExpense, expensesLoading,
    friendTransactions, setFriendTransactions, addFriendTransaction, editFriendTransaction, removeFriendTransaction,
    budgetGoals, setBudgetGoals, addBudgetGoal, editBudgetGoal, removeBudgetGoal, budgetGoalsLoading,
    savingsGoals, setSavingsGoals, addSavingsGoal, editSavingsGoal, removeSavingsGoal,
    exportData, importData,
  };
};

export { useFinanceData };
