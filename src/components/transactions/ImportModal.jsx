import { useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { parseCSV, buildImportRows } from "../../lib/csv";

export default function ImportModal({
  open,
  onClose,
  accounts,
  categories,
  onImport,
}) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setRows([]);
    setFileName("");
    setImporting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await file.text();
      const raw = parseCSV(text);
      if (raw.length === 0) {
        toast.error("That file doesn't have any rows to import.");
        setRows([]);
        return;
      }
      setRows(buildImportRows(raw, { accounts, categories }));
    } catch {
      toast.error("Could not read that file. Make sure it's a CSV export.");
      setRows([]);
    }
  };

  const validRows = rows.filter((r) => r.valid);

  const handleImport = async () => {
    setImporting(true);
    let ok = 0;
    for (const row of validRows) {
      const { error } = await onImport({
        date: row.date,
        type: row.type,
        amount: row.amount,
        note: row.note,
        account_id: row.accountId,
        category_id: row.categoryId,
      });
      if (!error) ok += 1;
    }
    setImporting(false);
    toast.success(`Imported ${ok} of ${validRows.length} transactions.`);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Import transactions"
      width="max-w-lg"
    >
      <div className="space-y-4">
        <p className="text-xs leading-5 text-ink-400">
          Upload a CSV with columns{" "}
          <code className="rounded bg-ink-100 px-1 py-0.5 dark:bg-white/[.08]">
            date, type, amount, category, account, note
          </code>
          . This matches the file produced by "Export CSV". Account and
          category names must already exist in your ledger.
        </p>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-paper/60 px-4 py-8 text-center transition hover:border-ledger-400 dark:border-white/[.09] dark:bg-white/[.035]">
          <UploadCloud size={20} className="text-ledger-500" />
          <span className="text-sm font-medium text-ink-700 dark:text-ink-200">
            {fileName || "Choose a CSV file"}
          </span>
          <span className="text-xs text-ink-400">or drop it here</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={onFile}
          />
        </label>

        {rows.length > 0 && (
          <div className="max-h-56 overflow-y-auto rounded-lg border border-ink-100 dark:border-white/[.07]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-paper dark:bg-ink-900">
                <tr className="text-ink-400">
                  <th className="px-3 py-2 font-medium">Row</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.rowNumber}
                    className="border-t border-ink-100 dark:border-white/[.06]"
                  >
                    <td className="px-3 py-2 text-ink-400">{r.rowNumber}</td>
                    <td className="px-3 py-2">{r.date}</td>
                    <td className="px-3 py-2 capitalize">{r.type}</td>
                    <td className="tabular px-3 py-2">{r.amount}</td>
                    <td className="px-3 py-2">
                      {r.valid ? (
                        <span className="inline-flex items-center gap-1 text-ledger-600 dark:text-ledger-300">
                          <CheckCircle2 size={13} /> Ready
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-rust-500"
                          title={r.errors.join(", ")}
                        >
                          <AlertCircle size={13} /> {r.errors[0]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-ink-400">
            {rows.length > 0
              ? `${validRows.length} of ${rows.length} rows ready to import`
              : ""}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={validRows.length === 0 || importing}
              onClick={handleImport}
            >
              {importing
                ? "Importing…"
                : `Import${validRows.length ? ` ${validRows.length}` : ""}`}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
