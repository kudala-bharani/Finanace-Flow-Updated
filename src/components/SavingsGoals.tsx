
import { useState } from 'react';
import { Plus, Target, Edit2, Trash2, Trophy, X } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { DatePicker } from "./ui/datepicker";
import { Money } from "./Money";
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from "./PageHeader";

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  description?: string;
}

export const SavingsGoals = () => {
  const { savingsGoals, addSavingsGoal, editSavingsGoal, removeSavingsGoal } = useFinanceData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: today,
    description: '',
  });
  // Track input amount for each goal by id
  const [inputAmounts, setInputAmounts] = useState<{ [goalId: string]: string }>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('formData:', formData);
    // Validate required fields
    if (!formData.name.trim() || formData.targetAmount === undefined || formData.currentAmount === undefined || !formData.targetDate) {
      toast({ title: 'Please fill in all required fields (name, target amount, current amount, and target date).', variant: 'destructive' });
      return;
    }
    const payload = {
      ...formData,
      targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : undefined,
    };
    console.log('payload:', payload);
    if (editingGoal) {
      await editSavingsGoal(editingGoal.id, payload);
    } else {
      await addSavingsGoal(payload);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: today,
      description: '',
    });
    setEditingGoal(null);
    setIsFormOpen(false);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
      description: goal.description || '',
    });
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      await removeSavingsGoal(id);
    }
  };

  const updateGoalAmount = async (id: string, amount: number) => {
    const goal = savingsGoals.find(g => g.id === id);
    if (goal) {
      await editSavingsGoal(id, { ...goal, currentAmount: goal.currentAmount + amount });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings Goals"
        subtitle="Track your progress toward financial goals"
        actions={(
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Goal</span>
          </button>
        )}
      />

      {/* Goals Grid */}
      {savingsGoals.length === 0 ? (
        <div className="bg-card rounded-lg p-8 border border-border text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No Savings Goals Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start saving for your dreams! Create your first savings goal to begin tracking your progress.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Savings Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isComplete = progress >= 100;
            const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div
                key={goal.id}
                className={
                  isComplete
                    ? "relative min-w-0 overflow-hidden rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 p-4 text-yellow-900 shadow-lg sm:p-6"
                    : "min-w-0 rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-slate-600 sm:p-6"
                }
              >
                {isComplete && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg motion-reduce:hidden" aria-hidden="true">
                    <div className="absolute -left-1/4 -top-1/4 h-[200%] w-[200%] rotate-12 animate-shine bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-40 blur-[8px]" />
                  </div>
                )}
                {/* Achieved heading */}
                {isComplete && (
                  <div className="mb-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-900">Achieved</span>
                  </div>
                )}
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {isComplete ? (
                      <Trophy className="size-6 shrink-0 text-yellow-700" aria-hidden="true" />
                    ) : (
                      <Target className="size-6 shrink-0 text-emerald-400" aria-hidden="true" />
                    )}
                    <h3 className={isComplete ? "min-w-0 break-words text-lg font-bold text-yellow-900" : "min-w-0 break-words text-lg font-semibold text-white"}>{goal.name}</h3>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${goal.name}`}
                      onClick={() => handleEdit(goal)}
                      className={isComplete ? "grid size-11 place-items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:size-8 text-yellow-700 hover:text-blue-400 transition-colors" : "grid size-11 place-items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:size-8 text-slate-400 hover:text-blue-400 transition-colors"}
                      disabled={isComplete}
                      style={isComplete ? { display: 'none' } : {}}
                    >
                      <Edit2 size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${goal.name}`}
                      onClick={() => handleDelete(goal.id)}
                      className={isComplete ? "grid size-11 place-items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:size-8 text-yellow-700 hover:text-red-400 transition-colors" : "grid size-11 place-items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:size-8 text-slate-400 hover:text-red-400 transition-colors"}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                
                {goal.description && (
                  <p className={`mb-4 break-words text-sm ${isComplete ? "text-yellow-900" : "text-slate-400"}`}>{goal.description}</p>
                )}
                
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm tabular-nums">
                    <span className={isComplete ? "text-yellow-800 font-semibold" : "text-slate-400"}>Progress</span>
                    <span className={isComplete ? "text-yellow-900 font-bold" : "text-white font-medium"}>{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className={isComplete ? "w-full bg-yellow-200 rounded-full h-2" : "w-full bg-slate-700 rounded-full h-2"}>
                    <div
                      className={`h-2 rounded-full ${isComplete ? 'bg-yellow-500' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm tabular-nums">
                    <span className={isComplete ? "text-yellow-800 font-semibold" : "text-slate-400"}>
                      <Money amount={goal.currentAmount} /> / <Money amount={goal.targetAmount} />
                    </span>
                    <span className={isComplete ? "font-bold text-yellow-900" : `font-medium ${daysLeft < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                    </span>
                  </div>
                  {!isComplete && (
                    <form className="mt-4 flex gap-2" onSubmit={e => {
                      e.preventDefault();
                      const amount = parseFloat(inputAmounts[goal.id] || "");
                      if (!isNaN(amount) && amount !== 0) {
                        updateGoalAmount(goal.id, amount);
                        setInputAmounts({ ...inputAmounts, [goal.id]: "" });
                      }
                    }}>
                      <input
                        type="number"
                        step="0.01"
                        value={inputAmounts[goal.id] || ''}
                        onFocus={e => { if (e.target.value === '0') e.target.value = ''; }}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || (/^\d*\.?\d*$/.test(val) && !val.startsWith('-'))) {
                            setInputAmounts({ ...inputAmounts, [goal.id]: val });
                          }
                        }}
                        onKeyDown={e => { if (e.key === '-') e.preventDefault(); }}
                        className="min-h-10 min-w-0 flex-1 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-emerald-400 placeholder-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
                        placeholder="Add amount"
                        aria-label={`Add amount to ${goal.name}`}
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded bg-emerald-500/20 px-4 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/30"
                      >
                        Add
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-auto rounded-lg border border-border bg-card p-4 shadow-xl sm:p-6">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <X size={24} aria-hidden="true" />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pt-8 sm:pt-0">
                <label htmlFor="goal-name" className="mb-2 block text-sm font-medium text-muted-foreground">Goal Name</label>
                <input
                  id="goal-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                  placeholder="Goal name (e.g., Emergency Fund, Vacation, New Car)"
                  required
                />
              </div>
              <div>
                <label htmlFor="goal-target" className="mb-2 block text-sm font-medium text-muted-foreground">Target Amount</label>
                <input
                  id="goal-target"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount === 0 ? '' : formData.targetAmount}
                  onFocus={e => { if (e.target.value === '0') e.target.value = ''; }}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || (/^\d*\.?\d*$/.test(val) && !val.startsWith('-'))) {
                      setFormData({ ...formData, targetAmount: val === '' ? 0 : parseFloat(val) });
                    }
                  }}
                  onKeyDown={e => { if (e.key === '-') e.preventDefault(); }}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                  placeholder="Target amount"
                  required
                />
              </div>
              <div>
                <label htmlFor="goal-current" className="mb-2 block text-sm font-medium text-muted-foreground">Current Amount</label>
                <input
                  id="goal-current"
                  type="number"
                  step="0.01"
                  value={formData.currentAmount === 0 ? '' : formData.currentAmount}
                  onFocus={e => { if (e.target.value === '0') e.target.value = ''; }}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || (/^\d*\.?\d*$/.test(val) && !val.startsWith('-'))) {
                      setFormData({ ...formData, currentAmount: val === '' ? 0 : parseFloat(val) });
                    }
                  }}
                  onKeyDown={e => { if (e.key === '-') e.preventDefault(); }}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                  placeholder="Current amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Target Date</label>
                <DatePicker
                  value={formData.targetDate ? new Date(formData.targetDate) : null}
                  onChange={date => setFormData(f => ({ ...f, targetDate: date.toISOString().slice(0, 10) }))}
                  className="mb-2"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded transition-colors"
                >
                  {editingGoal ? 'Update' : 'Add'} Goal
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-muted hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground py-2 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
