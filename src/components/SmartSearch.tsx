import { useState, useMemo } from 'react';
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { DatePicker } from "./ui/datepicker";
import { Money } from "./Money";

export const SmartSearch = () => {
  const { incomes, expenses } = useFinanceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'income', 'expense'
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  const allTransactions = useMemo(() => {
    return [
      ...incomes.map(income => ({ ...income, type: 'income' as const })),
      ...expenses.map(expense => ({ ...expense, type: 'expense' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incomes, expenses]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      // Search term filter
      const searchableText = [
        transaction.type === 'income' ? transaction.source : transaction.description,
        transaction.category,
        transaction.amount.toString()
      ].join(' ').toLowerCase();
      
      if (searchTerm && !searchableText.includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }

      // Date filters
      if (filters.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) {
        return false;
      }

      // Amount filters
      if (filters.amountMin && transaction.amount < parseFloat(filters.amountMin)) {
        return false;
      }
      if (filters.amountMax && transaction.amount > parseFloat(filters.amountMax)) {
        return false;
      }

      return true;
    });
  }, [allTransactions, searchTerm, filters]);

  const categories = Array.from(new Set(allTransactions.map(t => t.category)));

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-card-foreground">Smart Search</h1>
        <p className="text-muted-foreground">Quickly find transactions, accounts, and more</p>
      </div>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-12 py-3 bg-card border border-border rounded-lg text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-card rounded-lg p-4 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-card-foreground font-medium">Advanced Filters</h3>
            <button onClick={clearFilters} className="text-muted-foreground hover:text-card-foreground text-sm">
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.type}
              onValueChange={value => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="bg-muted border border-border rounded px-3 py-2 text-card-foreground w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category}
              onValueChange={value => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger className="bg-muted border border-border rounded px-3 py-2 text-card-foreground w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min Amount"
                value={filters.amountMin}
                onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                className="flex-1 bg-muted border border-border rounded px-3 py-2 text-card-foreground placeholder-muted-foreground"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={filters.amountMax}
                onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                className="flex-1 bg-muted border border-border rounded px-3 py-2 text-card-foreground placeholder-muted-foreground"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">From Date</label>
              <DatePicker
                value={filters.dateFrom ? new Date(filters.dateFrom) : null}
                onChange={date => setFilters(f => ({ ...f, dateFrom: date.toISOString().slice(0, 10) }))}
                placeholder="From Date"
                className="w-full mb-2"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">To Date</label>
              <DatePicker
                value={filters.dateTo ? new Date(filters.dateTo) : null}
                onChange={date => setFilters(f => ({ ...f, dateTo: date.toISOString().slice(0, 10) }))}
                placeholder="To Date"
                className="w-full mb-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-card-foreground font-medium">
            Search Results ({filteredTransactions.length} transactions)
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions found</p>
          ) : (
            <div className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <div key={`${transaction.type}-${transaction.id}`} className="p-4 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.type}
                        </span>
                        <h4 className="text-card-foreground font-medium">
                          {transaction.type === 'income' ? transaction.source : transaction.description}
                        </h4>
                        <span className="text-sm text-muted-foreground">{transaction.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}<Money amount={transaction.amount} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
