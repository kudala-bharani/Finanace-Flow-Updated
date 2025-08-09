import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  TrendingDown,
  Pencil,
  GripVertical,
  X,
} from "lucide-react";
import { useFinanceData, Expense } from "@/hooks/useFinanceData";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PieChartApex } from "./ui/PieChartApex";
import { SummaryCard } from "./ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { DatePicker } from "./ui/datepicker";
import { Money } from "./Money";
import { PageHeader } from "./PageHeader";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const expenseCategories = {
  food: "Food & Dining",
  transport: "Transport",
  shopping: "Shopping",
  entertainment: "Entertainment",
  utilities: "Utilities",
  healthcare: "Healthcare",
  education: "Education",
  other: "Other",
};

const descriptionCategoryMap: { [key: string]: string } = {
  zomato: "Food & Dining",
  swiggy: "Food & Dining",
  "uber eats": "Food & Dining",
  dominos: "Food & Dining",
  amazon: "Shopping",
  flipkart: "Shopping",
  myntra: "Shopping",
  ola: "Transport",
  uber: "Transport",
  metro: "Transport",
  bus: "Transport",
  netflix: "Entertainment",
  spotify: "Entertainment",
  prime: "Entertainment",
  electricity: "Utilities",
  water: "Utilities",
  internet: "Utilities",
  mobile: "Utilities",
  doctor: "Healthcare",
  medicine: "Healthcare",
  hospital: "Healthcare",
  course: "Education",
  book: "Education",
};

// Add a color palette for categories (theme-aware, similar to PIE_COLORS)
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

export const ExpenseTracker = () => {
  const { expenses, addExpense, editExpense, removeExpense } = useFinanceData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem("expenseCategories");
    return stored
      ? JSON.parse(stored)
      : [
          "Food & Dining",
          "Transport",
          "Shopping",
          "Entertainment",
          "Utilities",
          "Healthcare",
          "Education",
          "Other",
        ];
  });
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [formData, setFormData] = useState({
    amount: 0,
    description: "",
    category: categories[0] || "Other",
    date: new Date().toISOString().split("T")[0],
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("expenseCategories", JSON.stringify(categories));
  }, [categories]);

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };
  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx;
  };
  const handleDragEnd = () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const updated = [...categories];
      const [removed] = updated.splice(dragItem.current, 1);
      updated.splice(dragOverItem.current, 0, removed);
      setCategories(updated);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const autoCategorize = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    for (const [keyword, category] of Object.entries(descriptionCategoryMap)) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
    return "Other";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date).toISOString(),
    };
    if (editingExpense) {
      await editExpense(editingExpense.id, payload);
    } else {
      // Do not send id, let backend generate it
      await addExpense(payload);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      description: "",
      category: categories[0] || "Other",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      // Convert to YYYY-MM-DD for the date picker
      date: expense.date
        ? new Date(expense.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    });
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDescriptionChange = (description: string) => {
    const autoCategory = autoCategorize(description);
    setFormData({
      ...formData,
      description,
      category: autoCategory,
    });
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const currentMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  useEffect(() => {
    if (!editingExpense && formData.category !== (categories[0] || "Other")) {
      setFormData((f) => ({ ...f, category: categories[0] || "Other" }));
    }
  }, [categories, editingExpense]);

  // getPieData now uses categories from closure
  const getPieData = (data) => {
    const map = new Map();
    data.forEach((item) => {
      if (!item.category) return;
      map.set(item.category, (map.get(item.category) || 0) + item.amount);
    });
    return categories
      .filter((cat) => map.has(cat))
      .map((cat) => ({ name: cat, value: map.get(cat) }));
  };

  // Update pie data calls to not pass categories
  const totalPieData = getPieData(expenses);
  const monthPieData = getPieData(
    expenses.filter((expense) => {
      const date = new Date(expense.date);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader
        title="Expenses"
        subtitle="Track your spending and expenses"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Expenses" }]}
        actions={
          <div className="flex gap-2">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
          <Dialog open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center space-x-2 bg-muted hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 transition-colors font-semibold">
                <span>Manage Categories</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl p-0 overflow-hidden">
              <div className="w-full bg-card rounded-lg">
                <div className="flex items-center gap-2 px-6 pt-6 pb-2 border-b border-border">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <h2 className="text-lg font-bold text-card-foreground">
                    Manage Categories
                  </h2>
                </div>
                <div className="p-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        newCategory.trim() &&
                        !categories.includes(newCategory.trim())
                      ) {
                        setCategories([...categories, newCategory.trim()]);
                        setNewCategory("");
                      }
                    }}
                    className="flex gap-2 mb-6"
                  >
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add new category"
                      className="flex-1 px-4 py-2 rounded-full border border-border text-foreground bg-background focus:ring-2 focus:ring-red-400 outline-none transition shadow-sm"
                    />
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition shadow"
                    >
                      Add
                    </button>
                  </form>
                  <ul className="flex flex-col gap-3">
                    {categories.map((cat, idx) => (
                      <li
                        key={cat}
                        className="flex items-center bg-muted rounded-full px-4 py-2 shadow-sm group border border-border cursor-grab"
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragEnter={() => handleDragEnter(idx)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <GripVertical className="w-4 h-4 mr-2 text-muted-foreground opacity-60 cursor-grab" />
                        {editingIndex === idx ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="px-2 py-1 rounded-full border border-border text-foreground bg-background focus:ring-2 focus:ring-red-400 outline-none text-sm flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editingValue.trim())
                                  setCategories((s) =>
                                    s.map((v, i) =>
                                      i === idx ? editingValue.trim() : v
                                    )
                                  );
                                setEditingIndex(null);
                              }}
                              className="text-red-500 hover:text-red-700 px-2 py-1 rounded-full transition"
                              title="Save"
                            >
                              <span className="sr-only">Save</span>✔
                            </button>
                            <button
                              onClick={() => setEditingIndex(null)}
                              className="text-muted-foreground hover:text-red-700 px-2 py-1 rounded-full transition"
                              title="Cancel"
                            >
                              <span className="sr-only">Cancel</span>✖
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium text-card-foreground text-sm mr-2 flex-1">
                              {cat}
                            </span>
                            <TooltipProvider>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => {
                                      setEditingIndex(idx);
                                      setEditingValue(cat);
                                    }}
                                    className="hover:bg-red-100 dark:hover:bg-red-900 text-red-500 px-2 py-1 rounded-full transition"
                                    title="Edit"
                                  >
                                    <span className="sr-only">Edit</span>
                                    <Pencil size={16} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() =>
                                      setCategories((s) =>
                                        s.filter((_, i) => i !== idx)
                                      )
                                    }
                                    className="hover:bg-red-100 dark:hover:bg-red-900 text-red-500 px-2 py-1 rounded-full transition"
                                    title="Delete"
                                  >
                                    <span className="sr-only">Delete</span>
                                    <Trash2 size={16} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 mt-4">
        <SummaryCard
          icon={<TrendingDown className="w-7 h-7" />}
          title="This Month"
          value={<Money amount={currentMonthExpenses} />}
          color="orange"
        />
        <SummaryCard
          icon={<TrendingDown className="w-7 h-7" />}
          title="Total Expenses"
          value={<Money amount={totalExpenses} />}
          color="red"
        />
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center">
          <h3 className="font-semibold text-card-foreground mb-4">
            This Month by Category
          </h3>
          <div className="w-full">
            <PieChartApex
              series={monthPieData.map((d) => d.value)}
              labels={monthPieData.map((d) => d.name)}
              colors={CATEGORY_COLORS}
              height={270}
              totalLabel="This Month"
              totalFormatter={(sum) =>
                sum.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })
              }
            />
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center">
          <h3 className="font-semibold text-card-foreground mb-4">
            Total Expenses by Category
          </h3>
          <div className="w-full">
            <PieChartApex
              series={totalPieData.map((d) => d.value)}
              labels={totalPieData.map((d) => d.name)}
              colors={CATEGORY_COLORS}
              height={270}
              totalLabel="Total Expenses"
              totalFormatter={(sum) =>
                sum.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            Recent Expenses
          </h2>
        </div>
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {expenses.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <TrendingDown className="w-16 h-16 mb-4 opacity-40" />
              <p className="text-lg font-semibold mb-2">No expenses yet</p>
              <p className="text-base">
                Add your first expense to get started!
              </p>
            </div>
          ) : (
            expenses
              .sort((a, b) => {
                const dateDiff =
                  new Date(b.date).getTime() - new Date(a.date).getTime();
                if (dateDiff !== 0) return dateDiff;
                // If dates are equal, sort by id descending (assuming id is int or stringified int)
                return (Number(b.id) || 0) - (Number(a.id) || 0);
              })
              .map((expense) => {
                const colorIdx = categories.findIndex(
                  (cat) => cat === expense.category
                );
                const dotColor =
                  CATEGORY_COLORS[colorIdx % CATEGORY_COLORS.length] ||
                  CATEGORY_COLORS[0];
                return (
                  <div
                    key={expense.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-xl bg-muted/60 hover:bg-muted transition shadow-sm m-2"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className="font-semibold text-card-foreground text-base truncate">
                        {expense.description}
                      </span>
                      <span
                        className="px-2 py-1 text-xs rounded-full ml-2"
                        style={{
                          backgroundColor: dotColor + "22",
                          color: dotColor,
                        }}
                      >
                        {expense.category}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2 hidden md:inline">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className="text-xl font-bold text-red-400 md:text-2xl">
                        -<Money amount={expense.amount} />
                      </span>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleEdit(expense)}
                                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-muted-foreground hover:text-primary transition"
                                aria-label="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-muted-foreground hover:text-red-500 transition"
                                aria-label="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground md:hidden block mt-1">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </h3>
              <input
                type="text"
                placeholder="What did you spend on?"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                required
              />
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((f) => ({ ...f, category: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={formData.amount === 0 ? "" : formData.amount}
                onFocus={(e) => {
                  if (e.target.value === "0") e.target.value = "";
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  // Only allow positive numbers
                  if (
                    val === "" ||
                    (/^\d*\.?\d*$/.test(val) && !val.startsWith("-"))
                  ) {
                    setFormData((f) => ({
                      ...f,
                      amount: val === "" ? 0 : Number(val),
                    }));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "-") e.preventDefault();
                }}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                required
              />
              <DatePicker
                value={formData.date ? new Date(formData.date) : null}
                onChange={(date) =>
                  setFormData((f) => ({
                    ...f,
                    date: date.toISOString().slice(0, 10),
                  }))
                }
                className="mb-2"
              />
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors"
              >
                {editingExpense ? "Update Expense" : "Add Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel asChild>
              <button
                className="px-4 py-2 rounded border"
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white flex items-center justify-center min-w-[80px]"
                disabled={deleteLoading}
                onClick={async () => {
                  if (deleteId) {
                    setDeleteLoading(true);
                    try {
                      await removeExpense(deleteId);
                      toast({ title: "Expense deleted", variant: "default" });
                      setDeleteId(null);
                    } catch (err) {
                      toast({
                        title: "Failed to delete expense",
                        description: err?.message || String(err),
                        variant: "destructive",
                      });
                    } finally {
                      setDeleteLoading(false);
                    }
                  }
                }}
              >
                {deleteLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : null}
                Delete
              </button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
