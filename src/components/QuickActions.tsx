
import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, ArrowLeftRight, X } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { DatePicker } from "./ui/datepicker";
import { Money } from "./Money";

export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<'income' | 'expense' | 'transfer' | null>(null);
  const { addIncome, addExpense, addAccount } = useFinanceData();

  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
    category: '',
    source: '',
    fromAccount: '',
    toAccount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleQuickIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome = {
      id: Date.now().toString(),
      amount: formData.amount,
      source: formData.source,
      category: 'Other',
      date: formData.date,
      description: formData.description,
    };
    await addIncome(newIncome);
    resetForm();
  };

  const handleQuickExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now().toString(),
      amount: formData.amount,
      description: formData.description,
      category: 'Other',
      date: formData.date,
    };
    await addExpense(newExpense);
    resetForm();
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAccounts = accounts.map(account => {
      if (account.id === formData.fromAccount) {
        return { ...account, balance: account.balance - formData.amount };
      }
      if (account.id === formData.toAccount) {
        return { ...account, balance: account.balance + formData.amount };
      }
      return account;
    });
    await addAccount(newAccount);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      description: '',
      category: '',
      source: '',
      fromAccount: '',
      toAccount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setActiveForm(null);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
      >
        <Plus size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Action Buttons */}
      {!activeForm && (
        <div className="flex flex-col space-y-3 mb-4">
          <button
            onClick={() => setActiveForm('income')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <TrendingUp size={20} />
          </button>
          <button
            onClick={() => setActiveForm('expense')}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <TrendingDown size={20} />
          </button>
          <button
            onClick={() => setActiveForm('transfer')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ArrowLeftRight size={20} />
          </button>
        </div>
      )}

      {/* Forms */}
      {activeForm && (
        <div className="bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700 w-80 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">
              Quick {activeForm === 'income' ? 'Income' : activeForm === 'expense' ? 'Expense' : 'Transfer'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={activeForm === 'income' ? handleQuickIncome : activeForm === 'expense' ? handleQuickExpense : handleTransfer} className="space-y-3">
            <DatePicker
              value={formData.date ? new Date(formData.date) : null}
              onChange={date => setFormData(f => ({ ...f, date: date.toISOString().slice(0, 10) }))}
              className="mb-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              required
            />
            
            {activeForm === 'income' && (
              <input
                type="text"
                placeholder="Source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                required
              />
            )}
            
            {activeForm === 'expense' && (
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                required
              />
            )}
            
            {activeForm === 'transfer' && (
              <>
                <Select
                  value={formData.fromAccount}
                  onValueChange={value => setFormData({ ...formData, fromAccount: value })}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="From Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.toAccount}
                  onValueChange={value => setFormData({ ...formData, toAccount: value })}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="To Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded transition-colors"
            >
              Add {activeForm === 'income' ? 'Income' : activeForm === 'expense' ? 'Expense' : 'Transfer'}
            </button>
          </form>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="bg-slate-600 hover:bg-slate-500 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <X size={24} />
      </button>
    </div>
  );
};
