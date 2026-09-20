const LEVELS = [
  { label: "Very weak", color: "bg-rust-500" },
  { label: "Weak", color: "bg-rust-400" },
  { label: "Fair", color: "bg-amber-500" },
  { label: "Good", color: "bg-ledger-400" },
  { label: "Strong", color: "bg-emerald-500" },
];

/**
 * Lightweight, dependency-free password strength scorer.
 * Returns a 0-4 score plus a label/color for the meter UI.
 */
export function getPasswordStrength(password = "") {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const capped = Math.min(score, LEVELS.length - 1);
  return { score: capped, ...LEVELS[capped] };
}
