import { Trash2, TrendingUp, TrendingDown, Clock } from 'lucide-react';
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
    <section className="rounded-lg border border-border bg-card p-4 lg:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground lg:text-xl">
        <Clock className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        Recent Activity
      </h2>

      {allTransactions.length === 0 ? (
        <p className="py-4 text-center text-muted-foreground">No recent activity</p>
      ) : (
        <ul className="space-y-3" role="list">
          {allTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            const label = isIncome ? transaction.source : transaction.description;

            return (
              <li key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between gap-2 rounded-lg bg-muted p-3 transition-colors hover:bg-muted/70 sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <div className={`shrink-0 rounded-full p-2 ${isIncome ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {isIncome ? (
                      <TrendingUp className="size-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="size-4 text-red-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0 break-words">
                    <p className="font-medium text-card-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                      {!isIncome && ` • ${transaction.category}`}
                    </p>
                  </div>
                </div>
                <div className="flex max-w-[48%] shrink-0 items-center justify-end gap-1 sm:gap-2">
                  <span className="min-w-0 text-right font-bold tabular-nums [overflow-wrap:anywhere] sm:text-lg">
                    <Money amount={transaction.amount} />
                  </span>
                  <button
                    type="button"
                    aria-label={`Delete ${label}`}
                    onClick={() => handleDelete(transaction.id, transaction.type)}
                    className="grid size-8 shrink-0 place-items-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-red-400 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
