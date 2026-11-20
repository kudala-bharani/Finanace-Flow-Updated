import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Pencil,
  GripVertical,
  Trash2,
  Users,
} from "lucide-react";
import { useFinanceData } from "@/hooks/useFinanceData";
import { RecentActivity } from "@/components/RecentActivity";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Money } from "./Money";
import { PageHeader } from "./PageHeader";

function WelcomeMessage() {
  let name = "";
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.name) name = parsed.name;
    }
  } catch {
    // Use the generic greeting if the stored profile cannot be read.
  }
  return (
    <div className="text-lg text-muted-foreground break-words">
      Welcome to FinanceFlow,{" "}
      <span className="font-semibold">{name || "there"}</span>!
    </div>
  );
}

export const Dashboard = () => {
  const {
    accounts,
    incomes,
    expenses,
    friendTransactions,
    addIncome,
    addExpense,
    addFriendTransaction,
  } = useFinanceData();
  // Income source options (sync with localStorage)
  const [incomeSources, setIncomeSources] = useState<string[]>(() => {
    const stored = localStorage.getItem("incomeSources");
    return stored ? JSON.parse(stored) : ["Salary", "Parttime", "Other"];
  });
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("incomeSources");
      if (stored) setIncomeSources(JSON.parse(stored));
    };
    window.addEventListener("storage", handleStorage);
    // Also check on mount
    handleStorage();
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Expense category state (sync with localStorage)
  const [expenseCategories, setExpenseCategories] = useState<string[]>(() => {
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

  useEffect(() => {
    localStorage.setItem(
      "expenseCategories",
      JSON.stringify(expenseCategories)
    );
  }, [expenseCategories]);

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
      const updated = [...expenseCategories];
      const [removed] = updated.splice(dragItem.current, 1);
      updated.splice(dragOverItem.current, 0, removed);
      setExpenseCategories(updated);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const calculateTotalBalance = () => {
    const accountsTotal = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const moneyToReceive = friendTransactions
      .filter((t) => t.type === "receive" && !t.completed)
      .reduce((sum, t) => sum + t.amount, 0);
    const moneyToGive = friendTransactions
      .filter((t) => t.type === "give" && !t.completed)
      .reduce((sum, t) => sum + t.amount, 0);

    return accountsTotal + moneyToReceive - moneyToGive;
  };

  const calculateMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyIncome = incomes
      .filter((income) => {
        const date = new Date(income.date);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, income) => sum + income.amount, 0);

    const monthlyExpenses = expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return { monthlyIncome, monthlyExpenses };
  };

  const { monthlyIncome, monthlyExpenses } = calculateMonthlyStats();
  const totalBalance = calculateTotalBalance();

  const stats = [
    {
      title: "Total Balance",
      value: <Money amount={totalBalance} />,
      icon: Wallet,
      color: totalBalance >= 0 ? "text-emerald-400" : "text-red-400",
      bgColor: totalBalance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
    },
    {
      title: "Monthly Income",
      value: <Money amount={monthlyIncome} />,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Monthly Expenses",
      value: <Money amount={monthlyExpenses} />,
      icon: TrendingDown,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Net This Month",
      value: <Money amount={monthlyIncome - monthlyExpenses} />,
      icon: DollarSign,
      color:
        monthlyIncome - monthlyExpenses >= 0
          ? "text-emerald-400"
          : "text-red-400",
      bgColor:
        monthlyIncome - monthlyExpenses >= 0
          ? "bg-emerald-500/10"
          : "bg-red-500/10",
    },
  ];

  // Add state for managing income sources modal
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [newSource, setNewSource] = useState("");
  const [editingSourceIndex, setEditingSourceIndex] = useState<number | null>(
    null
  );
  const [editingSourceValue, setEditingSourceValue] = useState("");
  const sourceDragItem = useRef<number | null>(null);
  const sourceDragOverItem = useRef<number | null>(null);

  const handleSourceDragStart = (idx: number) => {
    sourceDragItem.current = idx;
  };
  const handleSourceDragEnter = (idx: number) => {
    sourceDragOverItem.current = idx;
  };
  const handleSourceDragEnd = () => {
    if (
      sourceDragItem.current !== null &&
      sourceDragOverItem.current !== null &&
      sourceDragItem.current !== sourceDragOverItem.current
    ) {
      const updated = [...incomeSources];
      const [removed] = updated.splice(sourceDragItem.current, 1);
      updated.splice(sourceDragOverItem.current, 0, removed);
      setIncomeSources(updated);
      localStorage.setItem("incomeSources", JSON.stringify(updated));
    }
    sourceDragItem.current = null;
    sourceDragOverItem.current = null;
  };

  // Replace setIncomes, setExpenses, setFriendTransactions with backend helpers
  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addIncome({
      amount: parseFloat(incomeForm.amount),
      source: incomeForm.source,
      category: incomeForm.source, // If you want to keep category same as source
      date: new Date(incomeForm.date).toISOString(),
      description: "",
    });
    setIncomeForm({
      amount: "",
      source: incomeSources[0] || "Other",
      date: new Date().toISOString().split("T")[0],
    });
  };
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExpense({
      amount: parseFloat(expenseForm.amount),
      description: expenseForm.description,
      category: expenseForm.category,
      date: new Date(expenseForm.date).toISOString(),
    });
    setExpenseForm({
      amount: "",
      description: "",
      category: expenseCategories[0] || "Other",
      date: new Date().toISOString().split("T")[0],
    });
  };
  const handleFriendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFriendTransaction({
      name: friendForm.name,
      amount: parseFloat(friendForm.amount),
      description: friendForm.reason,
      date: new Date(friendForm.date).toISOString(),
      type: friendForm.type as "give" | "receive",
      completed: false,
    });
    setFriendForm({
      name: "",
      amount: "",
      reason: "",
      type: "give",
      date: new Date().toISOString().split("T")[0],
    });
  };

  useEffect(() => {
    const source = incomeSources[0] || "Other";
    setIncomeForm((form) => form.source === source ? form : { ...form, source });
  }, [incomeSources]);

  useEffect(() => {
    const category = expenseCategories[0] || "Other";
    setExpenseForm((form) => form.category === category ? form : { ...form, category });
  }, [expenseCategories]);

  const [incomeForm, setIncomeForm] = useState({
    amount: "",
    source: incomeSources[0] || "Other",
    date: new Date().toISOString().split("T")[0],
  });
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    category: expenseCategories[0] || "Other",
    date: new Date().toISOString().split("T")[0],
  });
  const [friendForm, setFriendForm] = useState({
    name: "",
    amount: "",
    reason: "",
    type: "give",
    date: new Date().toISOString().split("T")[0],
  });

  // Add friendNames state and manage friends modal logic
  const [friendNames, setFriendNames] = useState<string[]>(() => {
    const stored = localStorage.getItem("friendNames");
    return stored ? JSON.parse(stored) : [];
  });
  const [newFriend, setNewFriend] = useState("");
  const [editingFriendIndex, setEditingFriendIndex] = useState<number | null>(
    null
  );
  const [editingFriendValue, setEditingFriendValue] = useState("");
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const friendDragItem = useRef<number | null>(null);
  const friendDragOverItem = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem("friendNames", JSON.stringify(friendNames));
  }, [friendNames]);

  const handleFriendDragStart = (idx: number) => {
    friendDragItem.current = idx;
  };
  const handleFriendDragEnter = (idx: number) => {
    friendDragOverItem.current = idx;
  };
  const handleFriendDragEnd = () => {
    if (
      friendDragItem.current !== null &&
      friendDragOverItem.current !== null &&
      friendDragItem.current !== friendDragOverItem.current
    ) {
      const updated = [...friendNames];
      const [removed] = updated.splice(friendDragItem.current, 1);
      updated.splice(friendDragOverItem.current, 0, removed);
      setFriendNames(updated);
    }
    friendDragItem.current = null;
    friendDragOverItem.current = null;
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview and quick actions"
      />
      <WelcomeMessage />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="min-w-0 rounded-xl border p-3 lg:p-4 flex flex-col justify-between bg-muted min-h-[80px] lg:min-h-[100px]"
            >
              <div className="flex items-center gap-2">
                <Icon className={`size-4 shrink-0 ${stat.color}`} />
                <span className="font-semibold text-xs lg:text-sm">
                  {stat.title}
                </span>
              </div>
              <div
                className={`text-base lg:text-lg font-bold tabular-nums [overflow-wrap:anywhere] ${stat.color} mt-2`}
              >
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg p-4 lg:p-6 border border-border">
        <h2 className="text-lg lg:text-xl font-semibold text-card-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-3 lg:gap-4">
          {/* Add Income Form */}
          <form
            onSubmit={handleIncomeSubmit}
            className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-3"
          >
            <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <h3 className="text-emerald-400 font-semibold text-sm lg:text-base">
                Add Income
              </h3>
              <Dialog open={isSourcesOpen} onOpenChange={setIsSourcesOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="rounded py-1 text-xs text-emerald-500 transition-colors hover:underline"
                  >
                    Manage Sources
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xl p-0" aria-describedby={undefined}>
                  <div className="w-full bg-card rounded-lg">
                    <div className="flex items-center gap-2 px-4 lg:px-6 pt-4 lg:pt-6 pb-2 border-b border-border">
                      <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                      <DialogTitle className="pr-8 text-base font-bold text-card-foreground lg:text-lg">
                        Manage Sources
                      </DialogTitle>
                    </div>
                    <div className="p-4 lg:p-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (
                            newSource.trim() &&
                            !incomeSources.includes(newSource.trim())
                          ) {
                            setIncomeSources([
                              ...incomeSources,
                              newSource.trim(),
                            ]);
                            setNewSource("");
                            localStorage.setItem(
                              "incomeSources",
                              JSON.stringify([
                                ...incomeSources,
                                newSource.trim(),
                              ])
                            );
                          }
                        }}
                        className="flex gap-2 mb-4 lg:mb-6"
                      >
                        <input
                          value={newSource}
                          onChange={(e) => setNewSource(e.target.value)}
                          placeholder="Add new source"
                          className="min-w-0 flex-1 px-3 lg:px-4 py-2 rounded-full border border-border text-foreground bg-background focus:ring-2 focus:ring-emerald-400 outline-none transition shadow-sm text-sm"
                        />
                        <button
                          type="submit"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 lg:px-5 py-2 rounded-full font-semibold transition shadow text-sm"
                        >
                          Add
                        </button>
                      </form>
                      <ul className="flex flex-col gap-2 lg:gap-3">
                        {incomeSources.map((src, idx) => (
                          <li
                            key={idx}
                            draggable
                            onDragStart={() => handleSourceDragStart(idx)}
                            onDragEnter={() => handleSourceDragEnter(idx)}
                            onDragEnd={handleSourceDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center gap-2 p-2 lg:p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <span className="min-w-0 flex-1 break-words text-sm lg:text-base">
                              {src}
                            </span>
                            <div className="flex shrink-0 gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSourceIndex(idx);
                                  setEditingSourceValue(src);
                                }}
                                className="p-1 hover:bg-background rounded transition-colors"
                              >
                                <Pencil className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = incomeSources.filter(
                                    (_, i) => i !== idx
                                  );
                                  setIncomeSources(updated);
                                  localStorage.setItem(
                                    "incomeSources",
                                    JSON.stringify(updated)
                                  );
                                }}
                                className="p-1 hover:bg-background rounded transition-colors text-red-500"
                              >
                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {editingSourceIndex !== null && (
                        <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-muted rounded-lg">
                          <div className="flex gap-2">
                            <input
                              value={editingSourceValue}
                              onChange={(e) => setEditingSourceValue(e.target.value)}
                              className="min-w-0 flex-1 px-3 lg:px-4 py-2 rounded border border-border text-foreground bg-background focus:ring-2 focus:ring-emerald-400 outline-none transition shadow-sm text-sm"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  editingSourceValue.trim() &&
                                  !incomeSources.includes(editingSourceValue.trim())
                                ) {
                                  const updated = [...incomeSources];
                                  updated[editingSourceIndex] = editingSourceValue.trim();
                                  setIncomeSources(updated);
                                  localStorage.setItem(
                                    "incomeSources",
                                    JSON.stringify(updated)
                                  );
                                }
                                setEditingSourceIndex(null);
                                setEditingSourceValue("");
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 lg:px-4 py-2 rounded font-semibold transition shadow text-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSourceIndex(null);
                                setEditingSourceValue("");
                              }}
                              className="bg-muted hover:bg-muted/80 text-foreground px-3 lg:px-4 py-2 rounded font-semibold transition shadow text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              aria-label="Amount"
              placeholder="Amount"
              value={incomeForm.amount}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, amount: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-emerald-500/30 bg-emerald-500/5 text-foreground focus:ring-2 focus:ring-emerald-400 outline-none transition text-sm"
              required
            />
            <Select
              value={incomeForm.source}
              onValueChange={(value) =>
                setIncomeForm({ ...incomeForm, source: value })
              }
            >
              <SelectTrigger aria-label="Income source" className="border-emerald-500/30 bg-emerald-500/5 text-foreground focus:ring-2 focus:ring-emerald-400 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {incomeSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="date"
              aria-label="Date"
              value={incomeForm.date}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, date: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-emerald-500/30 bg-emerald-500/5 text-foreground focus:ring-2 focus:ring-emerald-400 outline-none transition text-sm"
              required
            />
            <button
              type="submit"
              className="mt-auto min-h-10 rounded bg-emerald-500 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-emerald-600"
            >
              Add Income
            </button>
          </form>

          {/* Add Expense Form */}
          <form
            onSubmit={handleExpenseSubmit}
            className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-3"
          >
            <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <h3 className="text-orange-400 font-semibold text-sm lg:text-base">
                Add Expense
              </h3>
              <Dialog
                open={isCategoriesOpen}
                onOpenChange={setIsCategoriesOpen}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="rounded py-1 text-xs text-orange-500 transition-colors hover:underline"
                  >
                    Manage Categories
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xl p-0" aria-describedby={undefined}>
                  <div className="w-full bg-card rounded-lg">
                    <div className="flex items-center gap-2 px-4 lg:px-6 pt-4 lg:pt-6 pb-2 border-b border-border">
                      <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400" />
                      <DialogTitle className="pr-8 text-base font-bold text-card-foreground lg:text-lg">
                        Manage Categories
                      </DialogTitle>
                    </div>
                    <div className="p-4 lg:p-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (
                            newCategory.trim() &&
                            !expenseCategories.includes(newCategory.trim())
                          ) {
                            setExpenseCategories([
                              ...expenseCategories,
                              newCategory.trim(),
                            ]);
                            setNewCategory("");
                            localStorage.setItem(
                              "expenseCategories",
                              JSON.stringify([
                                ...expenseCategories,
                                newCategory.trim(),
                              ])
                            );
                          }
                        }}
                        className="flex gap-2 mb-4 lg:mb-6"
                      >
                        <input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Add new category"
                          className="min-w-0 flex-1 px-3 lg:px-4 py-2 rounded-full border border-border text-foreground bg-background focus:ring-2 focus:ring-orange-400 outline-none transition shadow-sm text-sm"
                        />
                        <button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-5 py-2 rounded-full font-semibold transition shadow text-sm"
                        >
                          Add
                        </button>
                      </form>
                      <ul className="flex flex-col gap-2 lg:gap-3">
                        {expenseCategories.map((cat, idx) => (
                          <li
                            key={idx}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragEnter={() => handleDragEnter(idx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center gap-2 p-2 lg:p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <span className="min-w-0 flex-1 break-words text-sm lg:text-base">
                              {cat}
                            </span>
                            <div className="flex shrink-0 gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingIndex(idx);
                                  setEditingValue(cat);
                                }}
                                className="p-1 hover:bg-background rounded transition-colors"
                              >
                                <Pencil className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = expenseCategories.filter(
                                    (_, i) => i !== idx
                                  );
                                  setExpenseCategories(updated);
                                  localStorage.setItem(
                                    "expenseCategories",
                                    JSON.stringify(updated)
                                  );
                                }}
                                className="p-1 hover:bg-background rounded transition-colors text-red-500"
                              >
                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {editingIndex !== null && (
                        <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-muted rounded-lg">
                          <div className="flex gap-2">
                            <input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="min-w-0 flex-1 px-3 lg:px-4 py-2 rounded border border-border text-foreground bg-background focus:ring-2 focus:ring-orange-400 outline-none transition shadow-sm text-sm"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  editingValue.trim() &&
                                  !expenseCategories.includes(
                                    editingValue.trim()
                                  )
                                ) {
                                  const updated = [...expenseCategories];
                                  updated[editingIndex] = editingValue.trim();
                                  setExpenseCategories(updated);
                                  localStorage.setItem(
                                    "expenseCategories",
                                    JSON.stringify(updated)
                                  );
                                }
                                setEditingIndex(null);
                                setEditingValue("");
                              }}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 lg:px-4 py-2 rounded font-semibold transition shadow text-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingIndex(null);
                                setEditingValue("");
                              }}
                              className="bg-muted hover:bg-muted/80 text-foreground px-3 lg:px-4 py-2 rounded font-semibold transition shadow text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              aria-label="Amount"
              placeholder="Amount"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, amount: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-orange-500/30 bg-orange-500/5 text-foreground focus:ring-2 focus:ring-orange-400 outline-none transition text-sm"
              required
            />
            <Select
              value={expenseForm.category}
              onValueChange={(value) =>
                setExpenseForm({ ...expenseForm, category: value })
              }
            >
              <SelectTrigger aria-label="Expense category" className="border-orange-500/30 bg-orange-500/5 text-foreground focus:ring-2 focus:ring-orange-400 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="text"
              placeholder="Description"
              aria-label="Description"
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, description: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-orange-500/30 bg-orange-500/5 text-foreground focus:ring-2 focus:ring-orange-400 outline-none transition text-sm"
              required
            />
            <input
              type="date"
              aria-label="Date"
              value={expenseForm.date}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, date: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-orange-500/30 bg-orange-500/5 text-foreground focus:ring-2 focus:ring-orange-400 outline-none transition text-sm"
              required
            />
            <button
              type="submit"
              className="mt-auto min-h-10 rounded bg-orange-500 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-orange-600"
            >
              Add Expense
            </button>
          </form>

          {/* Add Friend Transaction Form */}
          <form
            onSubmit={handleFriendSubmit}
            className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-3"
          >
            <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <h3 className="text-purple-400 font-semibold text-sm lg:text-base">
                Friend Transaction
              </h3>
              <Dialog open={isFriendsOpen} onOpenChange={setIsFriendsOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="rounded py-1 text-xs text-purple-500 transition-colors hover:underline"
                  >
                    Manage Friends
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xl p-0" aria-describedby={undefined}>
                  <div className="w-full bg-card rounded-lg">
                    <div className="flex items-center gap-2 px-4 lg:px-6 pt-4 lg:pt-6 pb-2 border-b border-border">
                      <Users className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                      <DialogTitle className="pr-8 text-base font-bold text-card-foreground lg:text-lg">
                        Manage Friends
                      </DialogTitle>
                    </div>
                    <div className="p-4 lg:p-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (
                            newFriend.trim() &&
                            !friendNames.includes(newFriend.trim())
                          ) {
                            setFriendNames([...friendNames, newFriend.trim()]);
                            setNewFriend("");
                            localStorage.setItem(
                              "friendNames",
                              JSON.stringify([...friendNames, newFriend.trim()])
                            );
                          }
                        }}
                        className="flex gap-2 mb-4 lg:mb-6"
                      >
                        <input
                          value={newFriend}
                          onChange={(e) => setNewFriend(e.target.value)}
                          placeholder="Add new friend"
                          className="min-w-0 flex-1 px-3 lg:px-4 py-2 rounded-full border border-border text-foreground bg-background focus:ring-2 focus:ring-purple-400 outline-none transition shadow-sm text-sm"
                        />
                        <button
                          type="submit"
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 lg:px-5 py-2 rounded-full font-semibold transition shadow text-sm"
                        >
                          Add
                        </button>
                      </form>
                      <ul className="flex flex-col gap-2 lg:gap-3">
                        {friendNames.map((friend, idx) => (
                          <li
                            key={idx}
                            draggable
                            onDragStart={() => handleFriendDragStart(idx)}
                            onDragEnter={() => handleFriendDragEnter(idx)}
                            onDragEnd={handleFriendDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center gap-2 p-2 lg:p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <span className="min-w-0 flex-1 break-words text-sm lg:text-base">
                              {friend}
                            </span>
                            <div className="flex shrink-0 gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFriendIndex(idx);
                                  setEditingFriendValue(friend);
                                }}
                                className="p-1 hover:bg-background rounded transition-colors"
                              >
                                <Pencil className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = friendNames.filter(
                                    (_, i) => i !== idx
                                  );
                                  setFriendNames(updated);
                                  localStorage.setItem(
                                    "friendNames",
                                    JSON.stringify(updated)
                                  );
                                }}
                                className="p-1 hover:bg-background rounded transition-colors text-red-500"
                              >
                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {editingFriendIndex !== null && (
                        <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-muted rounded-lg">
                          <div className="flex gap-2">
                            <input
                              value={editingFriendValue}
                              onChange={(e) =>
                                setEditingFriendValue(e.target.value)
                              }
                              className="min-w-0 flex-1 px-3 lg:px-4 py-2 rounded border border-border text-foreground bg-background focus:ring-2 focus:ring-purple-400 outline-none transition shadow-sm text-sm"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  editingFriendValue.trim() &&
                                  !friendNames.includes(
                                    editingFriendValue.trim()
                                  )
                                ) {
                                  const updated = [...friendNames];
                                  updated[editingFriendIndex] =
                                    editingFriendValue.trim();
                                  setFriendNames(updated);
                                  localStorage.setItem(
                                    "friendNames",
                                    JSON.stringify(updated)
                                  );
                                }
                                setEditingFriendIndex(null);
                                setEditingFriendValue("");
                              }}
                              className="bg-purple-500 hover:bg-purple-600 text-white px-3 lg:px-4 py-2 rounded font-semibold transition shadow text-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFriendIndex(null);
                                setEditingFriendValue("");
                              }}
                              className="bg-muted hover:bg-muted/80 text-foreground px-3 lg:px-4 py-2 rounded font-semibold transition shadow text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Select
              value={friendForm.name}
              onValueChange={(value) =>
                setFriendForm({ ...friendForm, name: value })
              }
            >
              <SelectTrigger aria-label="Friend" className="border-purple-500/30 bg-purple-500/5 text-foreground focus:ring-2 focus:ring-purple-400 text-sm">
                <SelectValue placeholder="Select Friend" />
              </SelectTrigger>
              <SelectContent>
                {friendNames.map((friend) => (
                  <SelectItem key={friend} value={friend}>
                    {friend}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              aria-label="Amount"
              placeholder="Amount"
              value={friendForm.amount}
              onChange={(e) =>
                setFriendForm({ ...friendForm, amount: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-purple-500/30 bg-purple-500/5 text-foreground focus:ring-2 focus:ring-purple-400 outline-none transition text-sm"
              required
            />
            <input
              type="text"
              placeholder="Reason"
              aria-label="Reason"
              value={friendForm.reason}
              onChange={(e) =>
                setFriendForm({ ...friendForm, reason: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-purple-500/30 bg-purple-500/5 text-foreground focus:ring-2 focus:ring-purple-400 outline-none transition text-sm"
              required
            />
            <Select
              value={friendForm.type}
              onValueChange={(value) =>
                setFriendForm({
                  ...friendForm,
                  type: value as "give" | "receive",
                })
              }
            >
              <SelectTrigger aria-label="Transaction type" className="border-purple-500/30 bg-purple-500/5 text-foreground focus:ring-2 focus:ring-purple-400 text-sm">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="give">I Give</SelectItem>
                <SelectItem value="receive">I Receive</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="date"
              aria-label="Date"
              value={friendForm.date}
              onChange={(e) =>
                setFriendForm({ ...friendForm, date: e.target.value })
              }
              className="h-10 w-full min-w-0 px-3 lg:px-4 rounded border border-purple-500/30 bg-purple-500/5 text-foreground focus:ring-2 focus:ring-purple-400 outline-none transition text-sm"
              required
            />
            <button
              type="submit"
              className="mt-auto min-h-10 rounded bg-purple-500 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-purple-600"
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>

      <RecentActivity />
    </div>
  );
};
