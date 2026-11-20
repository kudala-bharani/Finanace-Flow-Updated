import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Target, TriangleAlert, X } from "lucide-react";
import { useFinanceData, type BudgetGoal, type Expense } from "@/hooks/useFinanceData";
import { useExpenseCategories } from "../hooks/useExpenseCategories";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Money } from "./Money";
import { PageHeader } from "./PageHeader";
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
function getPreviousMonthSpending(category: string, expenses: Expense[]) {
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
    <svg height={radius * 2} width={radius * 2} aria-hidden="true">
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
      if (goal?.id) {
        await removeBudgetGoal(goal.id);
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
      <PageHeader
        title="Budget Goals"
        subtitle="Set and track your monthly spending goals"
        actions={(
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Set Budget</span>
          </button>
        )}
      />

      {/* Previous Month Summary */}
      {previousGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            Last Month's Budget Summary ({previousMonthLabel})
          </h2>
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {previousGoals.map((goal) => {
              const percentage = (goal.spent / goal.amount) * 100;
              const isOverBudget = goal.spent > goal.amount;
              const color = getCategoryColor(goal.category, categories);
              return (
                <div
                  key={goal.category + "-prev"}
                  className="min-w-0 bg-card rounded-lg border flex flex-col items-center gap-2 p-3 sm:p-4 text-center"
                  style={{ borderColor: color }}
                >
                  <div className="flex min-w-0 items-center justify-center gap-2">
                    <span
                      className="inline-block size-3 shrink-0 rounded"
                      aria-hidden="true"
                      style={{ background: color }}
                    />
                    <span className="break-words text-sm font-semibold" style={{ color }}>
                      {goal.category}
                    </span>
                  </div>
                  <div>
                    <CircularProgress
                      percent={percentage}
                      color={color}
                      overBudget={isOverBudget}
                    />
                  </div>
                  <div className="break-words text-xs text-muted-foreground tabular-nums">
                    <Money amount={goal.spent} /> /{" "}
                    <Money amount={goal.amount} />
                  </div>
                  <div
                    className={`flex flex-wrap items-center justify-center gap-2 text-sm font-bold tabular-nums ${
                      isOverBudget ? "text-red-500" : "text-card-foreground"
                    }`}
                  >
                    {percentage.toFixed(0)}%
                    {isOverBudget && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        Over
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* This Month's Budget Goals Heading */}
      {currentMonthGoals.length > 0 && (
        <h2 className="text-xl font-bold">This Month's Budget Goals</h2>
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
                className="rounded-lg border p-4 sm:p-6"
                style={{
                  borderColor: getCategoryColor(goal.category, categories),
                  background: hexToRgba(
                    getCategoryColor(goal.category, categories),
                    0.12
                  ),
                }}
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0 break-words">
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
                  <div className="ml-auto flex items-center gap-2 sm:gap-4">
                    <div className="text-right tabular-nums">
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
                    <div className="flex shrink-0 gap-1 sm:gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${goal.category} budget`}
                        onClick={() => handleEdit(goal)}
                        className="grid size-11 place-items-center rounded-md text-muted-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:size-8"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${goal.category} budget`}
                        onClick={() => handleDelete(goal.category)}
                        className="grid size-11 place-items-center rounded-md text-muted-foreground transition-colors hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:size-8"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getProgressColor(
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
                    <p className="flex items-start gap-2 text-sm font-medium text-red-400">
                      <TriangleAlert className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
                      <span>Over budget by <Money amount={goal.spent - goal.amount} /></span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-auto rounded-lg border border-border bg-card p-4 shadow-xl sm:p-6">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="mb-2 pr-10 text-lg font-semibold">
                {editingGoal ? "Edit Budget Goal" : "Set Budget Goal"}
              </h3>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={!!editingGoal}
              >
                <SelectTrigger className="w-full" aria-label="Budget category">
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
                aria-label="Budget amount"
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
