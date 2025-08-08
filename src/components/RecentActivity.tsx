import { useState } from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Money } from "./Money";

export const RecentActivity = () => {
  const { incomes, removeIncome, expenses, removeExpense } = useFinanceData();

  const allTransactions = [
    ...incomes.map(income => ({ ...income, type: 'income' as const })),
    ...expenses.map(expense => ({ ...expense, type: 'expense' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const handleDelete = async (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      await removeIncome(id);
    } else {
      await removeExpense(id);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-card-foreground">Recent Activity</h2>
      </div>
      
      <div className="space-y-3">
        {allTransactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          allTransactions.map((transaction) => (
            <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-card-foreground font-medium">
                    {transaction.type === 'income' ? transaction.source : transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                    {transaction.type === 'expense' && ` • ${transaction.category}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg"><Money amount={transaction.amount} /></span>
                <button
                  onClick={() => handleDelete(transaction.id, transaction.type)}
                  className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
