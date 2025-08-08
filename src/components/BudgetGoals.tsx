import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Target, X } from "lucide-react";
import { useFinanceData, BudgetGoal } from "@/hooks/useFinanceData";
import { useExpenseCategories } from "../hooks/useExpenseCategories";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Money } from "./Money";
import { useToast } from "@/hooks/use-toast";

// Add category color mapping (same order as categories)
const CATEGORY_COLORS = [
  "#f87171", // red-400
  "#fbbf24", // yellow-400
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a78bfa", // purple-400
  "#f472b6", // pink-400
  "#facc15", // amber-400
  "#4ade80", // green-400
  "#818cf8", // indigo-400
  "#38bdf8", // cyan-400
];

function getCategoryColor(category: string, categories: string[]) {
  const idx = categories.indexOf(category);
  return CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || "#a1a1aa"; // fallback gray
}

function hexToRgba(hex: string, alpha: number) {
  // Convert hex to rgba string
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Helper to get previous month and year
function getPreviousMonthYear() {
  const now = new Date();
  let month = now.getMonth() - 1;
  let year = now.getFullYear();
  if (month < 0) {
    month = 11;
    year -= 1;
  }
  return { month, year };
}

// Helper to get previous month spending for a category
function getPreviousMonthSpending(category: string, expenses: any[]) {
  const { month, year } = getPreviousMonthYear();
  return expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expense.category === category &&
        expenseDate.getMonth() === month &&
        expenseDate.getFullYear() === year
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
}

// Helper for circular progress SVG
function CircularProgress({
  percent,
  color,
  overBudget,
}: {
  percent: number;
  color: string;
  overBudget?: boolean;
}) {
  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.min(percent, 100);
  const strokeDashoffset = circumference - (clamped / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke={overBudget ? "#f87171" : "#e5e7eb"}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={overBudget ? "#f87171" : color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s" }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

// Utility to get YYYY-MM string for a date
function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

export const BudgetGoals = () => {
  const {
    expenses,
    budgetGoals,
    addBudgetGoal,
    editBudgetGoal,
    removeBudgetGoal,
    expensesLoading,
    budgetGoalsLoading,
  } = useFinanceData();
  const [categories, setCategories] = useExpenseCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BudgetGoal | null>(null);
  const [formData, setFormData] = useState({
    category: categories[0] || "",
    amount: 0,
  });
  const { toast } = useToast();

  // Calculate current month spending for each category
  const getCurrentMonthSpending = (category: string): number => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.category === category &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  useEffect(() => {
    console.log("[BudgetGoals] Expenses updated:", expenses);
    console.log("[BudgetGoals] Budget goals updated:", budgetGoals);
  }, [expenses, budgetGoals]);

  // Loading state: only render when both are loaded
  if (expensesLoading || budgetGoalsLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading budget goals...
      </div>
    );
  }

  console.log("BudgetGoals from backend:", budgetGoals);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const spent = getCurrentMonthSpending(formData.category);

    if (editingGoal) {
      await editBudgetGoal(editingGoal.id, { ...formData, spent });
    } else {
      // Check if budget already exists for this category in the current month
      const existingGoal = budgetGoals.find(
        (goal) =>
          goal.category === formData.category &&
          goal.month === currentMonth &&
          goal.year === currentYear
      );
      if (existingGoal) {
        toast({
          title: "Budget goal already exists for this category this month.",
          variant: "destructive",
        });
        return;
      }

      await addBudgetGoal({
        ...formData,
        spent,
        month: currentMonth,
        year: currentYear,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      category: categories[0] || "",
      amount: 0,
    });
    setEditingGoal(null);
    setIsFormOpen(false);
  };

  const handleEdit = (goal: BudgetGoal) => {
    setFormData({
      category: goal.category,
      amount: goal.amount,
    });
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = async (category: string) => {
    if (confirm("Are you sure you want to delete this budget goal?")) {
      const goal = budgetGoals.find((g) => g.category === category);
      if (goal && (goal as any).id) {
        await removeBudgetGoal((goal as any).id);
      }
    }
  };

  // Get current and previous month/year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JS months are 0-based
  const currentYear = now.getFullYear();
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear--;
  }

  // Update spent amounts with current data and log debug info
  const updatedGoals = budgetGoals.map((goal) => {
    // Only match current month/year goals
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const matchingExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expense.category === goal.category &&
        expenseDate.getMonth() === goal.month - 1 && // goal.month is 1-based, JS is 0-based
        expenseDate.getFullYear() === goal.year
      );
    });
    const spent = matchingExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    console.log(
      "[BudgetGoals][DEBUG] Goal:",
      goal.category,
      "Month:",
      goal.month,
      "Year:",
      goal.year
    );
    console.log("[BudgetGoals][DEBUG] Matching expenses:", matchingExpenses);
    console.log("[BudgetGoals][DEBUG] Calculated spent:", spent);
    return {
      ...goal,
      spent,
    };
  });

  // Filter budget goals for current and previous month using updatedGoals
  const currentMonthGoals = updatedGoals.filter(
    (g) => g.month === currentMonth && g.year === currentYear
  );
  const previousGoals = updatedGoals.filter(
    (g) => g.month === prevMonth && g.year === prevYear
  );
  const previousMonthLabel = new Date(prevYear, prevMonth - 1).toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );

  console.log("Debug budget goals:", {
    totalBudgetGoals: budgetGoals.length,
    currentMonth,
    currentYear,
    prevMonth,
    prevYear,
    currentMonthGoals: currentMonthGoals.length,
    previousGoals: previousGoals.length,
    sampleGoal: budgetGoals[0],
    allBudgetGoals: budgetGoals.map((g) => ({
      category: g.category,
      month: g.month,
      year: g.year,
      amount: g.amount,
    })),
  });

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage <= 50) return "bg-emerald-500";
    if (percentage <= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressWidth = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">
            Budget Goals
          </h1>
          <p className="text-muted-foreground">
            Set and track your monthly spending goals
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Set Budget</span>
        </button>
      </div>

      {/* Previous Month Summary */}
      {previousGoals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">
            Last Month's Budget Summary ({previousMonthLabel})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {previousGoals.map((goal) => {
              const percentage = (goal.spent / goal.amount) * 100;
              const isOverBudget = goal.spent > goal.amount;
              const color = getCategoryColor(goal.category, categories);
              return (
                <div
                  key={goal.category + "-prev"}
                  className="bg-card rounded-lg border flex flex-col items-center p-4 shadow-sm relative"
                  style={{ borderColor: color }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-block w-3 h-3 rounded"
                      style={{ background: color }}
                    />
                    <span className="font-semibold text-sm" style={{ color }}>
                      {goal.category}
                    </span>
                  </div>
                  <div className="mb-2">
                    <CircularProgress
                      percent={percentage}
                      color={color}
                      overBudget={isOverBudget}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    <Money amount={goal.spent} /> /{" "}
                    <Money amount={goal.amount} />
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      isOverBudget ? "text-red-500" : "text-card-foreground"
                    }`}
                  >
                    {percentage.toFixed(0)}%
                  </div>
                  {isOverBudget && (
                    <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                      Over
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* This Month's Budget Goals Heading */}
      {currentMonthGoals.length > 0 && (
        <h2 className="text-xl font-bold mb-3">This Month's Budget Goals</h2>
      )}

      {/* Budget Goals List */}
      <div className="space-y-4">
        {currentMonthGoals.length === 0 ? (
          <div className="bg-card rounded-lg p-8 border border-border text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              No Budget Goals Set
            </h3>
            <p className="text-muted-foreground mb-4">
              Set monthly budget goals for different categories to track your
              spending.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Set Your First Budget Goal
            </button>
          </div>
        ) : (
          currentMonthGoals.map((goal) => {
            const percentage = (goal.spent / goal.amount) * 100;
            const isOverBudget = goal.spent > goal.amount;
            return (
              <div
                key={goal.category}
                className="rounded-lg p-6 border"
                style={{
                  borderColor: getCategoryColor(goal.category, categories),
                  background: hexToRgba(
                    getCategoryColor(goal.category, categories),
                    0.12
                  ),
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{
                        color: getCategoryColor(goal.category, categories),
                      }}
                    >
                      {goal.category}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Spent: <Money amount={goal.spent} />
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          isOverBudget ? "text-red-400" : "text-card-foreground"
                        }`}
                      >
                        {percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <Money amount={goal.amount - goal.spent} /> left
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.category)}
                        className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                      goal.spent,
                      goal.amount
                    )}`}
                    style={{
                      width: `${getProgressWidth(goal.spent, goal.amount)}%`,
                    }}
                  />
                </div>
                {/* Over Budget Warning */}
                {isOverBudget && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm font-medium">
                      ⚠️ Over budget by{" "}
                      <Money amount={goal.spent - goal.amount} />
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modern Modal for Add/Edit Budget Goal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">
                {editingGoal ? "Edit Budget Goal" : "Set Budget Goal"}
              </h3>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={!!editingGoal}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editingGoal && (
                <p className="text-xs text-slate-400 mt-1">
                  Category cannot be changed when editing
                </p>
              )}
              <input
                type="number"
                step="0.01"
                placeholder="Budget Amount"
                value={formData.amount === 0 ? "" : formData.amount}
                onFocus={(e) => {
                  if (e.target.value === "0") e.target.value = "";
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (
                    val === "" ||
                    (/^\d*\.?\d*$/.test(val) && !val.startsWith("-"))
                  ) {
                    setFormData({
                      ...formData,
                      amount: val === "" ? 0 : parseFloat(val),
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "-") e.preventDefault();
                }}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
              >
                {editingGoal ? "Update" : "Set"} Budget
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
