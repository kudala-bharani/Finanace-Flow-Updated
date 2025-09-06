const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function signup({ name, email, password }) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function getAccounts() {
  const res = await fetch(`${API_BASE}/accounts`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch accounts");
  return res.json();
}

export async function createAccount(account) {
  const res = await fetch(`${API_BASE}/accounts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(account),
  });
  if (!res.ok) throw new Error("Failed to create account");
  return res.json();
}

export async function updateAccount(id, account) {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(account),
  });
  if (!res.ok) throw new Error("Failed to update account");
  return res.json();
}

export async function deleteAccount(id) {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete account");
  return res.json();
}

// Incomes
export async function getIncomes() {
  const res = await fetch(`${API_BASE}/incomes`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch incomes");
  return res.json();
}
export async function createIncome(income) {
  const res = await fetch(`${API_BASE}/incomes`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(income),
  });
  if (!res.ok) throw new Error("Failed to create income");
  return res.json();
}
export async function updateIncome(id, income) {
  const res = await fetch(`${API_BASE}/incomes/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(income),
  });
  if (!res.ok) throw new Error("Failed to update income");
  return res.json();
}
export async function deleteIncome(id) {
  const res = await fetch(`${API_BASE}/incomes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete income");
  return res.json();
}
// Expenses
export async function getExpenses() {
  const res = await fetch(`${API_BASE}/expenses`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}
export async function createExpense(expense) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}
export async function updateExpense(id, expense) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}
export async function deleteExpense(id) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}
// Friend Transactions
export async function getFriendTransactions() {
  const res = await fetch(`${API_BASE}/friend-transactions`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch friend transactions");
  return res.json();
}
export async function createFriendTransaction(tx) {
  const res = await fetch(`${API_BASE}/friend-transactions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(tx),
  });
  if (!res.ok) throw new Error("Failed to create friend transaction");
  return res.json();
}
export async function updateFriendTransaction(id, tx) {
  const res = await fetch(`${API_BASE}/friend-transactions/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(tx),
  });
  if (!res.ok) throw new Error("Failed to update friend transaction");
  return res.json();
}
export async function deleteFriendTransaction(id) {
  const res = await fetch(`${API_BASE}/friend-transactions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete friend transaction");
  return res.json();
}
// Budget Goals
export async function getBudgetGoals() {
  const res = await fetch(`${API_BASE}/budget-goals`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch budget goals");
  return res.json();
}
export async function createBudgetGoal(goal) {
  const res = await fetch(`${API_BASE}/budget-goals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error("Failed to create budget goal");
  return res.json();
}
export async function updateBudgetGoal(id, goal) {
  const res = await fetch(`${API_BASE}/budget-goals/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error("Failed to update budget goal");
  return res.json();
}
export async function deleteBudgetGoal(id) {
  const res = await fetch(`${API_BASE}/budget-goals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete budget goal");
  return res.json();
}
// Savings Goals
export async function getSavingsGoals() {
  const res = await fetch(`${API_BASE}/savings-goals`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch savings goals");
  return res.json();
}
export async function createSavingsGoal(goal) {
  const res = await fetch(`${API_BASE}/savings-goals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error("Failed to create savings goal");
  return res.json();
}
export async function updateSavingsGoal(id, goal) {
  const res = await fetch(`${API_BASE}/savings-goals/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error("Failed to update savings goal");
  return res.json();
}
export async function deleteSavingsGoal(id) {
  const res = await fetch(`${API_BASE}/savings-goals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete savings goal");
  return res.json();
}

export async function sendContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/contact`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to send contact form");
  return res.json();
}
