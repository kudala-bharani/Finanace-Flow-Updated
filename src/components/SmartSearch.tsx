import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
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
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-card-foreground">Smart Search</h1>
        <p className="text-muted-foreground">Find income and expenses by name, category, date, or amount</p>
      </div>
      {/* Search Bar */}
      <div className="relative">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="search"
          aria-label="Search transactions"
          placeholder="Search transactions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-14 py-3 bg-card border border-border rounded-lg text-card-foreground placeholder-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        />
        <button
          type="button"
          aria-label="Filters"
          aria-expanded={showFilters}
          aria-controls={showFilters ? "transaction-filters" : undefined}
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-card-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Filter className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div id="transaction-filters" className="space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h3 className="text-card-foreground font-medium">Advanced Filters</h3>
            <button onClick={clearFilters} className="text-muted-foreground hover:text-card-foreground text-sm">
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Select
              value={filters.type}
              onValueChange={value => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="w-full min-w-0 rounded border border-border bg-muted px-3 py-2 text-card-foreground" aria-label="Transaction type">
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
              <SelectTrigger className="w-full min-w-0 rounded border border-border bg-muted px-3 py-2 text-card-foreground" aria-label="Transaction category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min amount"
                aria-label="Minimum amount"
                value={filters.amountMin}
                onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                className="min-w-0 rounded border border-border bg-muted px-2 py-2 text-card-foreground placeholder-muted-foreground sm:px-3"
              />
              <input
                type="number"
                placeholder="Max amount"
                aria-label="Maximum amount"
                value={filters.amountMax}
                onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                className="min-w-0 rounded border border-border bg-muted px-2 py-2 text-card-foreground placeholder-muted-foreground sm:px-3"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div role="group" aria-label="From Date">
              <p className="mb-1 text-sm text-muted-foreground">From Date</p>
              <DatePicker
                value={filters.dateFrom ? new Date(filters.dateFrom) : null}
                onChange={date => setFilters(f => ({ ...f, dateFrom: date.toISOString().slice(0, 10) }))}
                placeholder="From Date"
                className="w-full"
              />
            </div>
            <div role="group" aria-label="To Date">
              <p className="mb-1 text-sm text-muted-foreground">To Date</p>
              <DatePicker
                value={filters.dateTo ? new Date(filters.dateTo) : null}
                onChange={date => setFilters(f => ({ ...f, dateTo: date.toISOString().slice(0, 10) }))}
                placeholder="To Date"
                className="w-full"
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
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.type}
                        </span>
                        <h4 className="min-w-0 break-words font-medium text-card-foreground">
                          {transaction.type === 'income' ? transaction.source : transaction.description}
                        </h4>
                        <span className="min-w-0 break-words text-sm text-muted-foreground">{transaction.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`max-w-[45%] break-words text-right text-lg font-bold tabular-nums ${
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
