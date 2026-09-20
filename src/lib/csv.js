export function transactionsToCSV(rows) {
  const headers = ["date", "type", "amount", "category", "account", "note"];
  const lines = [headers.join(",")];
  rows.forEach((r) => {
    const line = [
      r.date,
      r.type,
      r.amount,
      r.categories?.name ?? "",
      r.accounts?.name ?? "",
      (r.note ?? "").replace(/[\n,]/g, " "),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
    lines.push(line);
  });
  return lines.join("\n");
}

export function downloadCSV(filename, csvString) {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseCSV(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.replace(/"/g, "").trim());
  return lines.filter(Boolean).map((line) => {
    const values =
      line
        .match(/(".*?"|[^,]+)(?=,|$)/g)
        ?.map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"')) ?? [];
    const row = {};
    headers.forEach((h, i) => (row[h] = values[i] ?? ""));
    return row;
  });
}

const VALID_TYPES = ["income", "expense", "transfer"];

/**
 * Maps raw parseCSV() rows (date, type, amount, category, account, note)
 * onto the user's existing accounts/categories, and validates each row so
 * the Import Transactions modal can preview what will and won't import.
 */
export function buildImportRows(rawRows, { accounts = [], categories = [] }) {
  return rawRows.map((row, index) => {
    const type = (row.type || "").trim().toLowerCase();
    const amount = Number(row.amount);
    const accountName = (row.account || "").trim();
    const categoryName = (row.category || "").trim();

    const account = accounts.find(
      (a) => a.name.toLowerCase() === accountName.toLowerCase(),
    );
    const category = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
    );

    const errors = [];
    if (!row.date || Number.isNaN(new Date(row.date).getTime())) {
      errors.push("Invalid date");
    }
    if (!VALID_TYPES.includes(type)) {
      errors.push("Invalid type");
    }
    if (!amount || amount <= 0) {
      errors.push("Invalid amount");
    }
    if (!accountName) {
      errors.push("Missing account");
    } else if (!account) {
      errors.push(`Unknown account "${accountName}"`);
    }
    if (categoryName && !category) {
      errors.push(`Unknown category "${categoryName}"`);
    }

    return {
      rowNumber: index + 1,
      date: row.date,
      type,
      amount,
      note: row.note || "",
      accountId: account?.id ?? null,
      accountName,
      categoryId: category?.id ?? null,
      categoryName,
      valid: errors.length === 0,
      errors,
    };
  });
}
