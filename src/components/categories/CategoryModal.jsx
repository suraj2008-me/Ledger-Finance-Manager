import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { CATEGORY_COLORS } from "../../lib/constants";

const empty = { name: "", type: "expense", color: CATEGORY_COLORS[0] };

export default function CategoryModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (open) setForm(initial ? { ...empty, ...initial } : empty);
  }, [open, initial]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { error } = await onSave(form);
    if (!error) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit category" : "New category"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Category name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Groceries"
        />
        <div className="grid grid-cols-2 gap-2">
          {["expense", "income"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setForm({ ...form, type: t })}
              className={`rounded border px-3 py-1.5 text-sm capitalize ${
                form.type === t
                  ? "border-ledger-500 bg-ledger-50 text-ledger-700 dark:bg-ledger-900/40 dark:text-ledger-200"
                  : "border-hairline dark:border-hairline-dark text-ink-500 dark:text-ink-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div>
          <span className="mb-1.5 block text-sm text-ink-500 dark:text-ink-300">
            Colour
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className="h-7 w-7 rounded-full ring-offset-2 ring-offset-paper dark:ring-offset-ink-800"
                style={{
                  backgroundColor: c,
                  boxShadow: form.color === c ? `0 0 0 2px ${c}` : "none",
                }}
                aria-label={`Choose colour ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save category</Button>
        </div>
      </form>
    </Modal>
  );
}
