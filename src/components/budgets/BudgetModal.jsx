import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const empty = { category_id: "", monthly_limit: "" };

export default function BudgetModal({
  open,
  onClose,
  onSave,
  categories,
  initial,
}) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (open)
      setForm(
        initial
          ? {
              category_id: initial.category_id,
              monthly_limit: initial.monthly_limit,
            }
          : empty,
      );
  }, [open, initial]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { error } = await onSave({
      ...form,
      monthly_limit: Number(form.monthly_limit),
    });
    if (!error) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit budget" : "New budget"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label="Category"
          required
          disabled={!!initial}
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input
          label="Monthly limit"
          type="number"
          step="0.01"
          min="0"
          required
          value={form.monthly_limit}
          onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })}
          placeholder="0.00"
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save budget</Button>
        </div>
      </form>
    </Modal>
  );
}
