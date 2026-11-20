import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  Wallet,
  Coins,
  X,
  Users,
  Banknote,
} from "lucide-react";
import { useFinanceData, Account } from "@/hooks/useFinanceData";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Money } from "./Money";
import { PageHeader } from "./PageHeader";

const sectionStyles = {
  bank: {
    card: "border-border bg-card",
    header: "text-blue-400",
    icon: <Wallet className="w-5 h-5 shrink-0 text-blue-400" />,
    summary: "bg-muted border-border text-blue-400",
    money: "text-blue-400",
  },
  credit: {
    card: "border-border bg-card",
    header: "text-red-400",
    icon: <CreditCard className="w-5 h-5 shrink-0 text-red-400" />,
    summary: "bg-muted border-border text-red-400",
    money: "text-red-400",
  },
  cash: {
    card: "border-border bg-card",
    header: "text-green-400",
    icon: <Banknote className="w-5 h-5 shrink-0 text-green-400" />,
    summary: "bg-muted border-border text-green-400",
    money: "text-green-400",
  },
  coins: {
    card: "border-border bg-card",
    header: "text-yellow-400",
    icon: <Coins className="w-5 h-5 shrink-0 text-yellow-400" />,
    summary: "bg-muted border-border text-yellow-400",
    money: "text-yellow-400",
  },
  given: {
    card: "border-border bg-card",
    header: "text-purple-400",
    icon: <Users className="w-5 h-5 shrink-0 text-purple-400" />,
    summary: "bg-muted border-border text-purple-400",
    money: "text-purple-400",
  },
  taken: {
    card: "border-border bg-card",
    header: "text-pink-400",
    icon: <Users className="w-5 h-5 shrink-0 text-pink-400" />,
    summary: "bg-muted border-border text-pink-400",
    money: "text-pink-400",
  },
};

// Add accent bg color for each section for the plus icon
const sectionAccent = {
  bank: "bg-blue-500",
  credit: "bg-red-500",
  cash: "bg-green-500",
  coins: "bg-yellow-500",
};

export const AccountsManager = () => {
  const {
    accounts,
    addAccount,
    editAccount,
    removeAccount,
    friendTransactions,
  } = useFinanceData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Bank Account",
    balance: 0,
  });
  const [addType, setAddType] = useState<string | null>(null); // which type to add

  const accountTypes = ["Bank Account", "Credit Card", "Cash", "Coins"];

  // Check if account type requires a name
  const requiresName = (type: string) => {
    return type === "Bank Account" || type === "Credit Card";
  };

  // Auto-generate name for Cash and Coins accounts
  const getDefaultName = (type: string) => {
    switch (type) {
      case "Cash":
        return "Cash Wallet";
      case "Coins":
        return "Coin Collection";
      default:
        return "";
    }
  };

  // Open add modal for a specific type
  const openAddModal = (type: string) => {
    setAddType(type);
    setFormData({ name: "", type, balance: 0 });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalFormData = {
      ...formData,
      name: requiresName(formData.type)
        ? formData.name
        : getDefaultName(formData.type),
    };
    if (editingAccount) {
      await editAccount(editingAccount.id, finalFormData);
    } else {
      await addAccount(finalFormData);
    }
    setIsFormOpen(false);
    setAddType(null);
    setEditingAccount(null);
  };

  const resetForm = () => {
    setFormData({ name: "", type: "Bank Account", balance: 0 });
    setEditingAccount(null);
    setIsFormOpen(false);
    setAddType(null);
  };

  const handleEdit = (account: Account) => {
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
    });
    setEditingAccount(account);
    setIsFormOpen(true);
    setAddType(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      await removeAccount(id);
    }
  };

  // Group accounts by type and sort by balance descending
  const bankAccounts = accounts
    .filter((acc) => acc.type === "Bank Account")
    .sort((a, b) => b.balance - a.balance);
  const creditCards = accounts
    .filter((acc) => acc.type === "Credit Card")
    .sort((a, b) => b.balance - a.balance);
  const cashAccount = accounts.find((acc) => acc.type === "Cash");
  const coinsAccount = accounts.find((acc) => acc.type === "Coins");

  // Friend transactions
  const moneyGiven = friendTransactions.filter(
    (t) => t.type === "give" && !t.completed
  ); // Money you lent
  const moneyTaken = friendTransactions.filter(
    (t) => t.type === "receive" && !t.completed
  ); // Money you borrowed
  const totalGiven = moneyGiven.reduce((sum, t) => sum + t.amount, 0);
  const totalTaken = moneyTaken.reduce((sum, t) => sum + t.amount, 0);

  // Group and sum friend transactions by name
  function groupAndSumByName(transactions) {
    const map = new Map();
    for (const tx of transactions) {
      if (!map.has(tx.name)) {
        map.set(tx.name, { ...tx });
      } else {
        map.get(tx.name).amount += tx.amount;
      }
    }
    return Array.from(map.values());
  }

  const groupedMoneyGiven = groupAndSumByName(moneyGiven);
  const groupedMoneyTaken = groupAndSumByName(moneyTaken);

  // Totals for each section
  const totalBank = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalCredit = creditCards.reduce((sum, acc) => sum + acc.balance, 0);
  const cash = cashAccount ? cashAccount.balance : 0;
  const coins = coinsAccount ? coinsAccount.balance : 0;
  // Overall total
  const totalBalance =
    totalBank + totalGiven + cash + coins - totalCredit - totalTaken;

  // Helper for summary card
  const summaryCard = (type, count, total, label, icon, colorClass) => (
    <div
      className={`rounded-xl border-2 border-border bg-card p-4 flex flex-col items-start min-w-0 [overflow-wrap:anywhere] shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-semibold text-lg">{label}</span>
      </div>
      <div className="text-xs mb-1 text-muted-foreground">
        {count} {type === "given" || type === "taken" ? "transaction" : label.toLowerCase()}
        {count !== 1 ? "s" : ""}
      </div>
      <div className="text-2xl font-bold tabular-nums text-foreground">
        <Money amount={total} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        subtitle="Manage bank, cash, coins and friend balances"
      />

      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {summaryCard(
          "bank",
          bankAccounts.length,
          totalBank,
          "Bank Account",
          sectionStyles.bank.icon,
          sectionStyles.bank.summary
        )}
        {summaryCard(
          "credit",
          creditCards.length,
          totalCredit,
          "Credit Account",
          sectionStyles.credit.icon,
          sectionStyles.credit.summary
        )}
        {summaryCard(
          "cash",
          cashAccount ? 1 : 0,
          cash,
          "Cash Account",
          sectionStyles.cash.icon,
          sectionStyles.cash.summary
        )}
        {summaryCard(
          "coins",
          coinsAccount ? 1 : 0,
          coins,
          "Coins Account",
          sectionStyles.coins.icon,
          sectionStyles.coins.summary
        )}
        {summaryCard(
          "given",
          moneyGiven.length,
          totalGiven,
          "Money Given",
          sectionStyles.given.icon,
          sectionStyles.given.summary
        )}
        {summaryCard(
          "taken",
          moneyTaken.length,
          totalTaken,
          "Money Taken",
          sectionStyles.taken.icon,
          sectionStyles.taken.summary
        )}
      </div>

      {/* Overall total */}
      <div className="text-center text-2xl font-bold tabular-nums [overflow-wrap:anywhere]">
        Total:{" "}
        <span className="text-emerald-400">
          <Money amount={totalBalance} />
        </span>
      </div>

      {/* Accounts Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bank Accounts Section */}
        <div
          className={`relative rounded-xl border p-4 ${sectionStyles.bank.card}`}
        >
          {/* Plus icon in top right */}
          <div className="absolute top-4 right-4">
            <button
              className={`w-7 h-7 flex items-center justify-center rounded-full shadow ${sectionAccent.bank} hover:brightness-110 transition`}
              onClick={() => openAddModal("Bank Account")}
              type="button"
              aria-label="Add Bank Account"
              title="Add Bank Account"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
          <div
            className={`mb-4 flex min-h-7 items-center gap-2 pr-9 text-lg font-semibold ${sectionStyles.bank.header}`}
          >
            {sectionStyles.bank.icon} Bank Accounts
          </div>
          {bankAccounts.length === 0 ? (
            <div className="text-muted-foreground">No bank accounts yet</div>
          ) : (
            bankAccounts.map((account) => (
              <div
                key={account.id}
                className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-muted px-3 py-3 sm:px-4"
              >
                <div className="min-w-0 flex-[1_1_6rem] [overflow-wrap:anywhere]">
                  <div className="font-semibold">{account.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Bank Account
                  </div>
                </div>
                <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-1">
                  <div
                    className={`text-right text-lg font-bold tabular-nums [overflow-wrap:anywhere] ${sectionStyles.bank.money}`}
                  >
                    <Money amount={account.balance} />
                  </div>
                  <button
                    onClick={() => handleEdit(account)}
                    type="button"
                    aria-label={"Edit " + account.name}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-blue-400"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    type="button"
                    aria-label={"Delete " + account.name}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Credit Cards Section */}
        <div
          className={`relative rounded-xl border p-4 ${sectionStyles.credit.card}`}
        >
          <div className="absolute top-4 right-4">
            <button
              className={`w-7 h-7 flex items-center justify-center rounded-full shadow ${sectionAccent.credit} hover:brightness-110 transition`}
              onClick={() => openAddModal("Credit Card")}
              type="button"
              aria-label="Add Credit Card"
              title="Add Credit Card"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
          <div
            className={`mb-4 flex min-h-7 items-center gap-2 pr-9 text-lg font-semibold ${sectionStyles.credit.header}`}
          >
            {sectionStyles.credit.icon} Credit Accounts
          </div>
          {creditCards.length === 0 ? (
            <div className="text-muted-foreground">No credit accounts yet</div>
          ) : (
            creditCards.map((account) => (
              <div
                key={account.id}
                className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-muted px-3 py-3 sm:px-4"
              >
                <div className="min-w-0 flex-[1_1_6rem] [overflow-wrap:anywhere]">
                  <div className="font-semibold">{account.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Credit Card
                  </div>
                </div>
                <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-1">
                  <div
                    className={`text-right text-lg font-bold tabular-nums [overflow-wrap:anywhere] ${sectionStyles.credit.money}`}
                  >
                    <Money amount={account.balance} />
                  </div>
                  <button
                    onClick={() => handleEdit(account)}
                    type="button"
                    aria-label={"Edit " + account.name}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-blue-400"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    type="button"
                    aria-label={"Delete " + account.name}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Cash Accounts Section */}
        <div
          className={`relative rounded-xl border p-4 ${sectionStyles.cash.card}`}
        >
          {/* Plus icon only if not present */}
          {!cashAccount && (
            <div className="absolute top-4 right-4">
              <button
                className={`w-7 h-7 flex items-center justify-center rounded-full shadow ${sectionAccent.cash} hover:brightness-110 transition`}
                onClick={() => openAddModal("Cash")}
                type="button"
                aria-label="Add Cash Account"
                title="Add Cash Account"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
          )}
          <div
            className={`mb-4 flex min-h-7 items-center gap-2 pr-9 text-lg font-semibold ${sectionStyles.cash.header}`}
          >
            {sectionStyles.cash.icon} Cash Accounts
          </div>
          {!cashAccount ? (
            <div className="text-muted-foreground">No cash accounts yet</div>
          ) : (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-muted px-3 py-3 sm:px-4">
              <div className="min-w-0 flex-[1_1_6rem] [overflow-wrap:anywhere]">
                <div className="font-semibold">{cashAccount.name}</div>
                <div className="text-xs text-muted-foreground">Cash</div>
              </div>
              <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-1">
                <div
                  className={`text-right text-lg font-bold tabular-nums [overflow-wrap:anywhere] ${sectionStyles.cash.money}`}
                >
                  <Money amount={cashAccount.balance} />
                </div>
                <button
                  onClick={() => handleEdit(cashAccount)}
                  type="button"
                  aria-label={"Edit " + cashAccount.name}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-blue-400"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cashAccount.id)}
                  type="button"
                  aria-label={"Delete " + cashAccount.name}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Coins Accounts Section */}
        <div
          className={`relative rounded-xl border p-4 ${sectionStyles.coins.card}`}
        >
          {!coinsAccount && (
            <div className="absolute top-4 right-4">
              <button
                className={`w-7 h-7 flex items-center justify-center rounded-full shadow ${sectionAccent.coins} hover:brightness-110 transition`}
                onClick={() => openAddModal("Coins")}
                type="button"
                aria-label="Add Coins Account"
                title="Add Coins Account"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
          )}
          <div
            className={`mb-4 flex min-h-7 items-center gap-2 pr-9 text-lg font-semibold ${sectionStyles.coins.header}`}
          >
            {sectionStyles.coins.icon} Coins Accounts
          </div>
          {!coinsAccount ? (
            <div className="text-muted-foreground">No coins accounts yet</div>
          ) : (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-muted px-3 py-3 sm:px-4">
              <div className="min-w-0 flex-[1_1_6rem] [overflow-wrap:anywhere]">
                <div className="font-semibold">{coinsAccount.name}</div>
                <div className="text-xs text-muted-foreground">Coins</div>
              </div>
              <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-1">
                <div
                  className={`text-right text-lg font-bold tabular-nums [overflow-wrap:anywhere] ${sectionStyles.coins.money}`}
                >
                  <Money amount={coinsAccount.balance} />
                </div>
                <button
                  onClick={() => handleEdit(coinsAccount)}
                  type="button"
                  aria-label={"Edit " + coinsAccount.name}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-blue-400"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(coinsAccount.id)}
                  type="button"
                  aria-label={"Delete " + coinsAccount.name}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Money Given Section */}
        <div className={`rounded-xl border p-4 ${sectionStyles.given.card}`}>
          <div
            className={`flex items-center gap-2 mb-4 text-lg font-semibold ${sectionStyles.given.header}`}
          >
            {sectionStyles.given.icon} Money Given to Friends
          </div>
          {groupedMoneyGiven.length === 0 ? (
            <div className="text-muted-foreground">
              No money given to friends yet
            </div>
          ) : (
            groupedMoneyGiven.map((tx) => (
              <div
                key={tx.id}
                className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-muted px-3 py-3 sm:px-4"
              >
                <div className="min-w-0 flex-[1_1_6rem] [overflow-wrap:anywhere]">
                  <div className="font-semibold">{tx.name}</div>
                  <div className="text-xs text-muted-foreground">
                    To Receive
                  </div>
                </div>
                <div
                  className={`text-right text-lg font-bold tabular-nums [overflow-wrap:anywhere] ${sectionStyles.given.money}`}
                >
                  <Money amount={tx.amount} />
                </div>
              </div>
            ))
          )}
        </div>
        {/* Money Taken Section */}
        <div className={`rounded-xl border p-4 ${sectionStyles.taken.card}`}>
          <div
            className={`flex items-center gap-2 mb-4 text-lg font-semibold ${sectionStyles.taken.header}`}
          >
            {sectionStyles.taken.icon} Money Taken from Friends
          </div>
          {groupedMoneyTaken.length === 0 ? (
            <div className="text-muted-foreground">
              No money taken from friends yet
            </div>
          ) : (
            groupedMoneyTaken.map((tx) => (
              <div
                key={tx.id}
                className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-muted px-3 py-3 sm:px-4"
              >
                <div className="min-w-0 flex-[1_1_6rem] [overflow-wrap:anywhere]">
                  <div className="font-semibold">{tx.name}</div>
                  <div className="text-xs text-muted-foreground">To Give</div>
                </div>
                <div
                  className={`text-right text-lg font-bold tabular-nums [overflow-wrap:anywhere] ${sectionStyles.taken.money}`}
                >
                  <Money amount={tx.amount} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-xl sm:p-6">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="mb-2 pr-10 text-lg font-semibold">
                {editingAccount
                  ? `Edit ${formData.type}`
                  : addType
                  ? `Add ${addType}`
                  : "Add Account"}
              </h3>
              {/* Only show name for types that require it */}
              {requiresName(formData.type) && (
                <input
                  type="text"
                  aria-label="Account Name"
                  placeholder="Account Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground placeholder-muted-foreground"
                  required={requiresName(formData.type)}
                />
              )}
              <input
                type="number"
                step="0.01"
                aria-label="Balance"
                inputMode="decimal"
                placeholder="Balance"
                value={formData.balance}
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
                      balance: val === "" ? 0 : parseFloat(val),
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded transition-colors"
              >
                {editingAccount ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
