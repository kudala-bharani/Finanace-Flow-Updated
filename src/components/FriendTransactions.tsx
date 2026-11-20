import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Check,
  X,
  Users,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";
import { useFinanceData, FriendTransaction } from "@/hooks/useFinanceData";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import { SummaryCard } from "./ui/card";
import { PageHeader } from "./PageHeader";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { DatePicker } from "./ui/datepicker";
import { Money } from "./Money";
import { PieChartApex } from "./ui/PieChartApex";

export const FriendTransactions = () => {
  const {
    friendTransactions,
    addFriendTransaction,
    editFriendTransaction,
    removeFriendTransaction,
  } = useFinanceData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"receive" | "give">("receive");
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "give" as "receive" | "give",
  });

  // Friend name management state
  const [friendNames, setFriendNames] = useState<string[]>(() => {
    const token = localStorage.getItem("token");
    if (!token) return []; // No token means new user, start with empty friends
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

  // Auto-add friend names from transactions
  useEffect(() => {
    const transactionNames = new Set(friendTransactions.map((t) => t.name));
    const existingNames = new Set(friendNames);
    const newNames = Array.from(transactionNames).filter(
      (name) => !existingNames.has(name)
    );

    if (newNames.length > 0) {
      setFriendNames((prev) => [...prev, ...newNames]);
    }
  }, [friendTransactions]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date).toISOString(),
      completed: false,
    };
    await addFriendTransaction(payload);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      type: "give",
    });
    setIsFormOpen(false);
  };

  const markAsCompleted = async (id: string) => {
    await editFriendTransaction(id, {
      ...friendTransactions.find((t) => t.id === id)!,
      completed: true,
    });
  };

  const deleteTransaction = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await removeFriendTransaction(id);
    }
  };

  // Reverse logic: 'give' means I gave to friend (money to receive), 'receive' means I took from friend (money to give)
  const sortTx = (a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  };
  const pendingReceive = friendTransactions
    .filter((t) => t.type === "give" && !t.completed)
    .sort(sortTx); // money to receive
  const pendingGive = friendTransactions
    .filter((t) => t.type === "receive" && !t.completed)
    .sort(sortTx); // money to give
  const completedTransactions = friendTransactions
    .filter((t) => t.completed)
    .sort(sortTx);

  const totalToReceive = pendingReceive.reduce((sum, t) => sum + t.amount, 0);
  const totalToGive = pendingGive.reduce((sum, t) => sum + t.amount, 0);

  // Pie chart helpers
  const PIE_COLORS = [
    "#a78bfa",
    "#f472b6",
    "#fbbf24",
    "#34d399",
    "#60a5fa",
    "#f87171",
    "#facc15",
    "#4ade80",
    "#818cf8",
    "#38bdf8",
  ];
  const getPieData = (data, type) => {
    const map = new Map();
    data
      .filter((t) => t.type === type && !t.completed)
      .forEach((item) => {
        if (!item.name) return;
        map.set(item.name, (map.get(item.name) || 0) + item.amount);
      });
    return friendNames
      .filter((name) => map.has(name))
      .map((name) => ({ name, value: map.get(name) }));
  };
  // Reverse: totalGivenPie = type 'receive', totalReceivedPie = type 'give'
  const totalGivenPie = getPieData(friendTransactions, "receive");
  const totalReceivedPie = getPieData(friendTransactions, "give");

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader
        title="Friend Transactions"
        subtitle="Track money to receive and to give"
        actions={
          <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} aria-hidden="true" />
            <span>Add Transaction</span>
          </button>
          <Dialog open={isFriendsOpen} onOpenChange={setIsFriendsOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center space-x-2 bg-muted hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-500 px-4 py-2 rounded-lg border border-purple-500/40 transition-colors"
              >
                <Users size={20} />
                <span>Manage Friends</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-1.5rem)] w-11/12 max-w-xl overflow-y-auto rounded-lg p-0" aria-describedby={undefined}>
              <div className="w-full bg-card rounded-lg">
                <div className="flex items-center gap-2 px-4 pb-2 pt-6 pr-12 border-b border-border sm:px-6 sm:pr-12">
                  <Users className="w-5 h-5 text-purple-400" />
                  <DialogTitle className="text-lg font-bold leading-normal text-card-foreground">
                    Manage Friends
                  </DialogTitle>
                </div>
                <div className="p-4 sm:p-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        newFriend.trim() &&
                        !friendNames.includes(newFriend.trim())
                      ) {
                        setFriendNames([...friendNames, newFriend.trim()]);
                        setNewFriend("");
                      }
                    }}
                    className="flex gap-2 mb-6"
                  >
                    <input
                      value={newFriend}
                      onChange={(e) => setNewFriend(e.target.value)}
                      aria-label="Add new friend"
                      placeholder="Add new friend"
                      className="min-w-0 flex-1 px-4 py-2 rounded-full border border-border text-foreground bg-background focus:ring-2 focus:ring-purple-400 outline-none transition shadow-sm"
                    />
                    <button
                      type="submit"
                      className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-full font-semibold transition shadow"
                    >
                      Add
                    </button>
                  </form>
                  <ul className="flex flex-col gap-3">
                    {friendNames.map((name, idx) => (
                      <li
                        key={name}
                        className="flex items-center min-w-0 bg-muted rounded-full px-3 py-2 shadow-sm group sm:px-4 border border-border cursor-grab"
                        draggable
                        onDragStart={() => handleFriendDragStart(idx)}
                        onDragEnter={() => handleFriendDragEnter(idx)}
                        onDragEnd={handleFriendDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <GripVertical className="w-4 h-4 mr-2 text-muted-foreground opacity-60 cursor-grab" />
                        {editingFriendIndex === idx ? (
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <input
                              aria-label="Edit friend name"
                              value={editingFriendValue}
                              onChange={(e) =>
                                setEditingFriendValue(e.target.value)
                              }
                              className="px-2 py-1 rounded-full border border-border text-foreground bg-background focus:ring-2 focus:ring-purple-400 outline-none text-sm w-0 min-w-0 flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editingFriendValue.trim())
                                  setFriendNames((s) =>
                                    s.map((v, i) =>
                                      i === idx ? editingFriendValue.trim() : v
                                    )
                                  );
                                setEditingFriendIndex(null);
                              }}
                              className="text-purple-500 hover:text-purple-700 px-2 py-1 rounded-full transition"
                              title="Save"
                            >
                              <span className="sr-only">Save</span>✔
                            </button>
                            <button
                              onClick={() => setEditingFriendIndex(null)}
                              className="text-muted-foreground hover:text-purple-700 px-2 py-1 rounded-full transition"
                              title="Cancel"
                            >
                              <span className="sr-only">Cancel</span>✖
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium min-w-0 text-card-foreground text-sm mr-2 flex-1 [overflow-wrap:anywhere]">
                              {name}
                            </span>
                            <TooltipProvider>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => {
                                      setEditingFriendIndex(idx);
                                      setEditingFriendValue(name);
                                    }}
                                    className="hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-500 px-2 py-1 rounded-full transition"
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
                                      setFriendNames((s) =>
                                        s.filter((_, i) => i !== idx)
                                      )
                                    }
                                    className="hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-500 px-2 py-1 rounded-full transition"
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
      <div className="grid grid-cols-1 gap-4 mb-4 mt-4 md:grid-cols-2 lg:gap-6">
        <SummaryCard
          icon={<Users className="w-7 h-7" />}
          title="Money to Receive"
          value={<Money amount={totalToReceive} />}
          color="emerald"
          className="min-w-0 gap-3 p-4 tabular-nums sm:gap-4 sm:p-6 [&>div:last-child]:min-w-0 [&>div:last-child]:break-words"
        />
        <SummaryCard
          icon={<Users className="w-7 h-7" />}
          title="Money to Give"
          value={<Money amount={totalToGive} />}
          color="red"
          className="min-w-0 gap-3 p-4 tabular-nums sm:gap-4 sm:p-6 [&>div:last-child]:min-w-0 [&>div:last-child]:break-words"
        />
      </div>

      {/* Pie charts below summary cards, above transactions table */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:gap-6 lg:mb-8">
        <div className="flex min-w-0 flex-col items-center rounded-lg border border-border bg-card p-4 sm:p-6">
          <h3 className="mb-4 text-center font-semibold text-card-foreground">
            Total Given to Friends
          </h3>
          <div className="w-full min-w-0 max-sm:[&_.apexcharts-datalabel-value]:!text-sm">
            <PieChartApex
              series={totalReceivedPie.map((d) => d.value)}
              labels={totalReceivedPie.map((d) => d.name)}
              colors={PIE_COLORS}
              height={270}
              totalLabel="Total Given"
              totalFormatter={(sum) =>
                sum.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })
              }
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col items-center rounded-lg border border-border bg-card p-4 sm:p-6">
          <h3 className="mb-4 text-center font-semibold text-card-foreground">
            Total Taken from Friends
          </h3>
          <div className="w-full min-w-0 max-sm:[&_.apexcharts-datalabel-value]:!text-sm">
            <PieChartApex
              series={totalGivenPie.map((d) => d.value)}
              labels={totalGivenPie.map((d) => d.name)}
              colors={PIE_COLORS}
              height={270}
              totalLabel="Total Taken"
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

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("receive")}
            aria-pressed={activeTab === "receive"}
            className={`min-w-0 flex-1 px-2 py-3 text-sm font-medium transition-colors sm:px-6 sm:py-4 ${
              activeTab === "receive"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            Money to Receive ({pendingReceive.length})
          </button>
          <button
            onClick={() => setActiveTab("give")}
            aria-pressed={activeTab === "give"}
            className={`min-w-0 flex-1 px-2 py-3 text-sm font-medium transition-colors sm:px-6 sm:py-4 ${
              activeTab === "give"
                ? "text-red-400 border-b-2 border-red-400 bg-red-500/5"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            Money to Give ({pendingGive.length})
          </button>
        </div>

        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {activeTab === "receive" && (
            <>
              {pendingReceive.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No money to receive. All caught up!</p>
                </div>
              ) : (
                pendingReceive.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <div className="min-w-0 flex-[1_1_7rem] [overflow-wrap:anywhere]">
                        <h3 className="font-semibold text-card-foreground">
                          {transaction.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2">
                        <div className="text-right text-lg font-bold tabular-nums text-emerald-500 [overflow-wrap:anywhere]">
                          +<Money amount={transaction.amount} />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markAsCompleted(transaction.id)}
                            className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-500 transition"
                            aria-label={"Mark transaction with " + transaction.name + " as completed"}
                            title="Mark as completed"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 transition"
                            aria-label={"Delete transaction with " + transaction.name}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "give" && (
            <>
              {pendingGive.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No money to give. All caught up!</p>
                </div>
              ) : (
                pendingGive.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <div className="min-w-0 flex-[1_1_7rem] [overflow-wrap:anywhere]">
                        <h3 className="font-semibold text-card-foreground">
                          {transaction.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2">
                        <div className="text-right text-lg font-bold tabular-nums text-red-500 [overflow-wrap:anywhere]">
                          -<Money amount={transaction.amount} />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markAsCompleted(transaction.id)}
                            className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-500 transition"
                            aria-label={"Mark transaction with " + transaction.name + " as completed"}
                            title="Mark as completed"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 transition"
                            aria-label={"Delete transaction with " + transaction.name}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-xl sm:p-6">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="mb-2 pr-10 text-lg font-semibold">Add Transaction</h3>
              <div className="flex items-center gap-2">
                <Select
                  value={formData.name}
                  onValueChange={(value) =>
                    setFormData((f) => ({ ...f, name: value }))
                  }
                  required
                >
                  <SelectTrigger className="flex-1" aria-label="Select friend">
                    <SelectValue placeholder="Select friend" />
                  </SelectTrigger>
                  <SelectContent>
                    {friendNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                aria-label="Amount"
                placeholder="Amount"
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
              <input
                type="text"
                aria-label="Reason"
                placeholder="Reason"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                required
              />
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((f) => ({
                    ...f,
                    type: value as "receive" | "give",
                  }))
                }
                required
              >
                <SelectTrigger className="w-full" aria-label="Select type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="give">I gave to friend</SelectItem>
                  <SelectItem value="receive">I took from friend</SelectItem>
                </SelectContent>
              </Select>
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
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition-colors"
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
