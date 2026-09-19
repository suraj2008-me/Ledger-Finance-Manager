export const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "JPY", symbol: "¥" },
  { code: "SGD", symbol: "S$" },
];

export const ACCOUNT_TYPES = [
  { value: "bank", label: "Bank account" },
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit card" },
  { value: "savings", label: "Savings" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" },
];

export const TRANSACTION_TYPES = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "transfer", label: "Transfer" },
];

export const RECURRENCE_OPTIONS = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const CATEGORY_COLORS = [
  "#1F5F4F",
  "#B4502A",
  "#C98A2C",
  "#2E6B8F",
  "#6D4E9B",
  "#7A8B4E",
  "#9C5B7A",
  "#4E6B62",
  "#B0763B",
  "#3F5D8A",
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Groceries", color: "#B4502A" },
  { name: "Rent", color: "#6D4E9B" },
  { name: "Utilities", color: "#2E6B8F" },
  { name: "Transport", color: "#C98A2C" },
  { name: "Dining out", color: "#9C5B7A" },
  { name: "Health", color: "#7A8B4E" },
  { name: "Shopping", color: "#B0763B" },
  { name: "Entertainment", color: "#3F5D8A" },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: "Salary", color: "#1F5F4F" },
  { name: "Freelance", color: "#4E6B62" },
  { name: "Investments", color: "#3F5D8A" },
  { name: "Gifts", color: "#9C5B7A" },
];
