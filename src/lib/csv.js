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
