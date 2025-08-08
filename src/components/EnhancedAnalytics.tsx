
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useFinanceData } from '@/hooks/useFinanceData';
import { TrendingUp, TrendingDown, Calculator, Target } from 'lucide-react';
import { SummaryCard } from './ui/card';
import React from 'react';
import { Money } from "./Money";

// Custom tooltip for charts with theme-aware colors
const CustomChartTooltip = ({ active, payload, label }) => {
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
          {entry.name}: <Money amount={entry.value} />
        </div>
      ))}
    </div>
  );
};

export const EnhancedAnalytics = () => {
  const { incomes, expenses } = useFinanceData();

  const getLast6MonthsData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const monthlyIncome = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === date.getMonth() && incomeDate.getFullYear() === date.getFullYear();
      }).reduce((sum, income) => sum + income.amount, 0);
      
      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear();
      }).reduce((sum, expense) => sum + expense.amount, 0);
      
      months.push({
        month: monthName,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        savings: monthlyIncome - monthlyExpenses
      });
    }
    
    return months;
  };

  const getSpendingTrends = () => {
    const categories = ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare'];
    const last3Months = [];
    const now = new Date();
    
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthData = { month: monthName };
      categories.forEach(category => {
        const spent = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === date.getMonth() && 
                 expenseDate.getFullYear() === date.getFullYear() &&
                 expense.category === category;
        }).reduce((sum, expense) => sum + expense.amount, 0);
        
        monthData[category] = spent;
      });
      
      last3Months.push(monthData);
    }
    
    return last3Months;
  };

  const calculateSavingsRate = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = incomes.filter(income => {
      const date = new Date(income.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, income) => sum + income.amount, 0);
    
    const monthlyExpenses = expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    return monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  };

  const predictMonthEnd = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const daysRemaining = daysInMonth - daysPassed;
    
    const currentMonthExpenses = expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    const dailyAverage = currentMonthExpenses / daysPassed;
    const predictedTotal = currentMonthExpenses + (dailyAverage * daysRemaining);
    
    return {
      current: currentMonthExpenses,
      predicted: predictedTotal,
      dailyAverage
    };
  };

  const monthlyData = getLast6MonthsData();
  const trendData = getSpendingTrends();
  const savingsRate = calculateSavingsRate();
  const prediction = predictMonthEnd();

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-card-foreground">Enhanced Analytics</h1>
        <p className="text-muted-foreground">Advanced charts and trends for deeper financial analysis</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <SummaryCard
          icon={<Target className="w-7 h-7" />}
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          color="emerald"
        />
        <SummaryCard
          icon={<Calculator className="w-7 h-7" />}
          title="Daily Average"
          value={`$${prediction.dailyAverage.toFixed(0)}`}
          color="blue"
        />
        <SummaryCard
          icon={<TrendingUp className="w-7 h-7" />}
          title="Predicted Month End"
          value={`$${prediction.predicted.toFixed(0)}`}
          color="purple"
        />
      </div>

      {/* Income vs Expenses Trend */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">6-Month Financial Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomChartTooltip />} />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }} />
              <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Spending Trends */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Category Spending Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(16,185,129,0.08)' }} />
              {/* Remove default activeBar by not setting activeBar prop, and use a subtle cursor color */}
              <Bar dataKey="Food & Dining" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Transport" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Shopping" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Entertainment" fill="#EC4899" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Utilities" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Healthcare" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
