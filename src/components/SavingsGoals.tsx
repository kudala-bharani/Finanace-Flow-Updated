
import { useState } from 'react';
import { Plus, Target, Edit2, Trash2, Trophy } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { DatePicker } from "./ui/datepicker";
import { Money } from "./Money";
import { useToast } from '@/hooks/use-toast';

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Savings Goals</h1>
          <p className="text-slate-400">Track your progress toward financial goals</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Goal</span>
        </button>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isComplete = progress >= 100;
            const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div
                key={goal.id}
                className={
                  isComplete
                    ? "relative rounded-lg p-6 transition-colors text-yellow-900 shadow-lg overflow-hidden border-2 border-yellow-400 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600"
                    : "bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
                }
              >
                {/* Gold shine animation overlay */}
                {isComplete && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                    <div className="absolute -top-1/4 -left-1/4 w-[200%] h-[200%] animate-shine bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-40 rotate-12" style={{filter: 'blur(8px)'}} />
                  </div>
                )}
                {/* Achieved heading */}
                {isComplete && (
                  <div className="mb-2 flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-black drop-shadow">Achieved</span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {isComplete ? (
                      <Trophy className="w-6 h-6 text-yellow-600 drop-shadow" />
                    ) : (
                      <Target className="w-6 h-6 text-emerald-400" />
                    )}
                    <h3 className={isComplete ? "text-lg font-bold text-yellow-900" : "text-lg font-semibold text-white"}>{goal.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className={isComplete ? "p-1 text-yellow-700 hover:text-blue-400 transition-colors" : "p-1 text-slate-400 hover:text-blue-400 transition-colors"}
                      disabled={isComplete}
                      style={isComplete ? { display: 'none' } : {}}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className={isComplete ? "p-1 text-yellow-700 hover:text-red-400 transition-colors" : "p-1 text-slate-400 hover:text-red-400 transition-colors"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-slate-400 text-sm mb-4">{goal.description}</p>
                )}
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className={isComplete ? "text-yellow-800 font-semibold" : "text-slate-400"}>Progress</span>
                    <span className={isComplete ? "text-yellow-900 font-bold" : "text-white font-medium"}>{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className={isComplete ? "w-full bg-yellow-200 rounded-full h-2" : "w-full bg-slate-700 rounded-full h-2"}>
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${isComplete ? 'bg-yellow-500' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={isComplete ? "text-yellow-800 font-semibold" : "text-slate-400"}>
                      <Money amount={goal.currentAmount} /> / <Money amount={goal.targetAmount} />
                    </span>
                    <span className={isComplete ? "font-bold text-yellow-700" : `font-medium ${daysLeft < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                    </span>
                  </div>
                  {!isComplete && (
                    <form className="flex space-x-2 mt-4" onSubmit={e => {
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
                        className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-emerald-400 placeholder-emerald-400 text-sm focus:outline-none"
                        placeholder="Add amount"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded text-sm hover:bg-emerald-500/30 transition-colors"
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
          <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                  placeholder="Goal name (e.g., Emergency Fund, Vacation, New Car)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Target Amount</label>
                <input
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
                <label className="block text-sm font-medium text-muted-foreground mb-2">Current Amount</label>
                <input
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
