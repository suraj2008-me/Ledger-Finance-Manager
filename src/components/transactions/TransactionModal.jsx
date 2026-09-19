import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { TRANSACTION_TYPES, RECURRENCE_OPTIONS } from "../../lib/constants";
import { todayISO } from "../../lib/formatters";

const empty = {
  type: "expense",
  amount: "",
  date: todayISO(),
  category_id: "",
  account_id: "",
  note: "",
  recurrence: "none",
};

export default function TransactionModal({
  open,
  onClose,
  onSave,
  categories,
  accounts,
  initial,
}) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (open) setForm(initial ? { ...empty, ...initial } : empty);
  }, [open, initial]);

  const filteredCategories = categories.filter(
    (c) => c.type === form.type || form.type === "transfer",
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.account_id) return;
    // `initial` comes from Supabase with joined `categories` and `accounts`
    // objects. Those are read-only relation data and must never be sent back
    // as columns when updating the transactions row.
    const {
      categories: _categories,
      accounts: _accounts,
      id: _id,
      user_id: _userId,
      created_at: _createdAt,
      ...transactionForm
    } = form;
    const payload = {
      ...transactionForm,
      amount: Number(form.amount),
      category_id: form.category_id || null,
    };
    const { error } = await onSave(payload);
    if (!error) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit entry" : "New entry"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {TRANSACTION_TYPES.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() =>
                setForm({ ...form, type: t.value, category_id: "" })
              }
              className={`rounded border px-2 py-1.5 text-sm transition-colors ${
                form.type === t.value
                  ? t.value === "income"
                    ? "border-ledger-500 bg-ledger-50 text-ledger-700 dark:bg-ledger-900/40 dark:text-ledger-200"
                    : t.value === "expense"
                      ? "border-rust-500 bg-rust-50 text-rust-600 dark:bg-rust-900/30 dark:text-rust-200"
                      : "border-ink-400 bg-ink-50 dark:bg-ink-800"
                  : "border-hairline dark:border-hairline-dark text-ink-500 dark:text-ink-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          required
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="0.00"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Select
            label="Account"
            required
            value={form.account_id}
            onChange={(e) => setForm({ ...form, account_id: e.target.value })}
          >
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>

        {form.type !== "transfer" && (
          <Select
            label="Category"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Uncategorised</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        )}

        <Select
          label="Repeats"
          value={form.recurrence}
          onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
        >
          {RECURRENCE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>

        <Input
          label="Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="What was this for?"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save entry</Button>
        </div>
      </form>
    </Modal>
  );
}
