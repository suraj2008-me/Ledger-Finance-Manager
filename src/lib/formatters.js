import { CURRENCIES } from "./constants";

export function symbolFor(code) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code ?? "";
}

export function formatMoney(amount, currency = "INR", { signed = false } = {}) {
  const n = Number(amount) || 0;
  const symbol = symbolFor(currency);
  const abs = Math.abs(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = signed ? (n < 0 ? "-" : n > 0 ? "+" : "") : n < 0 ? "-" : "";
  return `${sign}${symbol}${abs}`;
}

export function formatCompact(amount, currency = "INR") {
  const n = Number(amount) || 0;
  const symbol = symbolFor(currency);
  const abs = Math.abs(n);
  let out;
  if (abs >= 10000000) out = (abs / 10000000).toFixed(2) + "Cr";
  else if (abs >= 100000) out = (abs / 100000).toFixed(2) + "L";
  else if (abs >= 1000) out = (abs / 1000).toFixed(1) + "k";
  else out = abs.toFixed(0);
  return `${n < 0 ? "-" : ""}${symbol}${out}`;
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: opts.year === false ? undefined : "numeric",
  });
}

export function monthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function startOfMonthISO(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}

export function endOfMonthISO(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);
}
