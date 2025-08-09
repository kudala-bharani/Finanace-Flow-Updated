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
    icon: <Wallet className="w-5 h-5 text-blue-400" />,
    summary: "bg-muted border-border text-blue-400",
    money: "text-blue-400",
  },
  credit: {
    card: "border-border bg-card",
    header: "text-red-400",
    icon: <CreditCard className="w-5 h-5 text-red-400" />,
    summary: "bg-muted border-border text-red-400",
    money: "text-red-400",
  },
  cash: {
    card: "border-border bg-card",
    header: "text-green-400",
    icon: <Banknote className="w-5 h-5 text-green-400" />,
    summary: "bg-muted border-border text-green-400",
    money: "text-green-400",
  },
  coins: {
    card: "border-border bg-card",
    header: "text-yellow-400",
    icon: <Coins className="w-5 h-5 text-yellow-400" />,
    summary: "bg-muted border-border text-yellow-400",
    money: "text-yellow-400",
  },
  given: {
    card: "border-border bg-card",
    header: "text-purple-400",
    icon: <Users className="w-5 h-5 text-purple-400" />,
    summary: "bg-muted border-border text-purple-400",
    money: "text-purple-400",
  },
  taken: {
    card: "border-border bg-card",
    header: "text-pink-400",
    icon: <Users className="w-5 h-5 text-pink-400" />,
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
      className={`rounded-xl border-2 border-border bg-card p-4 flex flex-col items-start min-w-[160px] shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-semibold text-lg">{label}</span>
      </div>
      <div className="text-xs mb-1 text-muted-foreground">
        {count} {label.toLowerCase()}
        {count !== 1 ? "s" : ""}
      </div>
      <div className="text-2xl font-bold text-foreground">
        <Money amount={total} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        subtitle="Manage bank, cash, coins and friend balances"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Accounts" }]}
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
      <div className="mt-2 mb-4 text-2xl font-bold text-center">
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
              title="Add Bank Account"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
          <div
            className={`flex items-center gap-2 mb-4 text-lg font-semibold ${sectionStyles.bank.header}`}
          >
            {sectionStyles.bank.icon} Bank Accounts
          </div>
          {bankAccounts.length === 0 ? (
            <div className="text-muted-foreground">No bank accounts yet</div>
          ) : (
            bankAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 mb-2"
              >
                <div>
                  <div className="font-semibold">{account.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Bank Account
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-lg font-bold ${sectionStyles.bank.money}`}
                  >
                    <Money amount={account.balance} />
                  </div>
                  <button
                    onClick={() => handleEdit(account)}
                    className="text-muted-foreground hover:text-blue-400"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-muted-foreground hover:text-red-400"
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
              title="Add Credit Card"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
          <div
            className={`flex items-center gap-2 mb-4 text-lg font-semibold ${sectionStyles.credit.header}`}
          >
            {sectionStyles.credit.icon} Credit Accounts
          </div>
          {creditCards.length === 0 ? (
            <div className="text-muted-foreground">No credit accounts yet</div>
          ) : (
            creditCards.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 mb-2"
              >
                <div>
                  <div className="font-semibold">{account.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Credit Card
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-lg font-bold ${sectionStyles.credit.money}`}
                  >
                    <Money amount={account.balance} />
                  </div>
                  <button
                    onClick={() => handleEdit(account)}
                    className="text-muted-foreground hover:text-blue-400"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-muted-foreground hover:text-red-400"
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
                title="Add Cash Account"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
          )}
          <div
            className={`flex items-center gap-2 mb-4 text-lg font-semibold ${sectionStyles.cash.header}`}
          >
            {sectionStyles.cash.icon} Cash Accounts
          </div>
          {!cashAccount ? (
            <div className="text-muted-foreground">No cash accounts yet</div>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 mb-2">
              <div>
                <div className="font-semibold">{cashAccount.name}</div>
                <div className="text-xs text-muted-foreground">Cash</div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`text-lg font-bold ${sectionStyles.cash.money}`}
                >
                  <Money amount={cashAccount.balance} />
                </div>
                <button
                  onClick={() => handleEdit(cashAccount)}
                  className="text-muted-foreground hover:text-blue-400"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cashAccount.id)}
                  className="text-muted-foreground hover:text-red-400"
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
                title="Add Coins Account"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
          )}
          <div
            className={`flex items-center gap-2 mb-4 text-lg font-semibold ${sectionStyles.coins.header}`}
          >
            {sectionStyles.coins.icon} Coins Accounts
          </div>
          {!coinsAccount ? (
            <div className="text-muted-foreground">No coins accounts yet</div>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 mb-2">
              <div>
                <div className="font-semibold">{coinsAccount.name}</div>
                <div className="text-xs text-muted-foreground">Coins</div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`text-lg font-bold ${sectionStyles.coins.money}`}
                >
                  <Money amount={coinsAccount.balance} />
                </div>
                <button
                  onClick={() => handleEdit(coinsAccount)}
                  className="text-muted-foreground hover:text-blue-400"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(coinsAccount.id)}
                  className="text-muted-foreground hover:text-red-400"
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
                className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 mb-2"
              >
                <div>
                  <div className="font-semibold">{tx.name}</div>
                  <div className="text-xs text-muted-foreground">
                    To Receive
                  </div>
                </div>
                <div
                  className={`text-lg font-bold ${sectionStyles.given.money}`}
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
                className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 mb-2"
              >
                <div>
                  <div className="font-semibold">{tx.name}</div>
                  <div className="text-xs text-muted-foreground">To Give</div>
                </div>
                <div
                  className={`text-lg font-bold ${sectionStyles.taken.money}`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={resetForm}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">
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
