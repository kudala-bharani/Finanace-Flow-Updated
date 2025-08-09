import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinanceData } from '@/hooks/useFinanceData';
import { SummaryCard } from './ui/card';
import { PageHeader } from './PageHeader';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import React from 'react';
import { Money } from "./Money";
import { PieChartApex } from './ui/PieChartApex';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

// Custom tooltip for PieChart with theme-aware colors
const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return (
    <div
      style={{
        background: isDark ? '#222' : '#fff',
        color: isDark ? '#fff' : '#222',
        border: '1px solid hsl(var(--border))',
        borderRadius: 8,
        padding: '8px 12px',
        fontWeight: 600,
        fontSize: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      ${payload[0].value.toLocaleString()}
    </div>
  );
};

// Custom tooltip for BarChart with theme-aware colors
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return (
    <div
      style={{
        background: isDark ? '#222' : '#fff',
        color: isDark ? '#fff' : '#222',
        border: '1px solid hsl(var(--border))',
        borderRadius: 8,
        padding: '8px 12px',
        fontWeight: 600,
        fontSize: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      {label && <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{label}</div>}
      {payload.map((entry, idx) => (
        <div key={idx} style={{ color: entry.color, fontWeight: 600 }}>
          {entry.name}: ${entry.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export const Analytics = () => {
  const { incomes, expenses } = useFinanceData();

  // Monthly data for bar charts
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    [...incomes, ...expenses].forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if ('source' in item) {
        monthlyData[monthKey].income += item.amount;
      } else {
        monthlyData[monthKey].expenses += item.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: data.income,
        expenses: data.expenses,
      }));
  };

  // Income sources pie chart data (group by source, not category)
  const getIncomeSourcesData = () => {
    const sources: { [key: string]: number } = {};
    incomes.forEach(income => {
      sources[income.source] = (sources[income.source] || 0) + income.amount;
    });
    return Object.entries(sources).map(([source, amount]) => ({
      name: source,
      value: amount,
    }));
  };

  // Expense categories pie chart data
  const getExpenseCategoriesData = () => {
    const categories: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categories).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const monthlyData = getMonthlyData();
  const incomeSourcesData = getIncomeSourcesData();
  const expenseCategoriesData = getExpenseCategoriesData();

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        subtitle="Visual insights into your financial data"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Analytics' }]}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <SummaryCard
          icon={<TrendingUp className="w-7 h-7" />}
          title="Total Income"
          value={<Money amount={totalIncome} />}
          color="emerald"
        />
        <SummaryCard
          icon={<TrendingDown className="w-7 h-7" />}
          title="Total Expenses"
          value={<Money amount={totalExpenses} />}
          color="red"
        />
        <SummaryCard
          icon={<Wallet className="w-7 h-7" />}
          title="Net Balance"
          value={<Money amount={totalIncome - totalExpenses} />}
          color={(totalIncome - totalExpenses) >= 0 ? 'emerald' : 'red'}
        />
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-6">Monthly Trends</h2>
        {monthlyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No data available for monthly trends</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) =>
                  typeof value === 'number'
                    ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
                    : value
                }
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(16,185,129,0.08)' }} />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Sources */}
        <div className="bg-card rounded-lg p-6 border border-border flex flex-col items-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-6 text-center w-full">Income Sources</h2>
          {incomeSourcesData.length > 0 ? (
            <div className="w-full">
              <PieChartApex
                series={incomeSourcesData.map(d => d.value)}
                labels={incomeSourcesData.map(d => d.name)}
                colors={COLORS}
                height={300}
                totalLabel="Total Income"
                totalFormatter={sum => sum.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No income data available</p>
            </div>
          )}
        </div>
        {/* Expense Categories */}
        <div className="bg-card rounded-lg p-6 border border-border flex flex-col items-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-6 text-center w-full">Expense Categories</h2>
          {expenseCategoriesData.length > 0 ? (
            <div className="w-full">
              <PieChartApex
                series={expenseCategoriesData.map(d => d.value)}
                labels={expenseCategoriesData.map(d => d.name)}
                colors={COLORS}
                height={300}
                totalLabel="Total Expenses"
                totalFormatter={sum => sum.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No expense data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
