import { useState } from "react";
import { PiggyBank, Plus } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import BudgetRow from "../components/budgets/BudgetRow";
import BudgetModal from "../components/budgets/BudgetModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { useBudgets } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import { useAuth } from "../context/AuthContext";

export default function Budgets() {
  const {
    budgets,
    spendByCategory,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();
  const { categories } = useCategories();
  const { profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const budgetedIds = new Set(budgets.map((b) => b.category_id));
  const available = categories.filter(
    (c) => c.type === "expense" && !budgetedIds.has(c.id),
  );

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const totalBudget = budgets.reduce((s, b) => s + Number(b.monthly_limit), 0);
  const totalSpent = budgets.reduce(
    (s, b) => s + (spendByCategory[b.category_id] ?? 0),
    0,
  );

  return (
    <AppShell title="Budgets" onQuickAdd={openNew}>
      <div className="">
        {!loading && budgets.length > 0 && (
          <div className="mb-8 flex items-baseline justify-between">
            <div>
              <p className="text-sm text-ink-400">This month, budgeted</p>
              <p className="font-display text-3xl text-ink-900 dark:text-paper">
                {((totalSpent / (totalBudget || 1)) * 100).toFixed(0)}% used
              </p>
            </div>
            <Button size="sm" onClick={openNew}>
              <Plus size={14} /> Set budget
            </Button>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : budgets.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="No budgets set"
            description="Set a monthly limit on a category to keep spending in check."
            action={<Button onClick={openNew}>Set your first budget</Button>}
          />
        ) : (
          <div className="rounded-md border border-hairline dark:border-hairline-dark px-6 hairline-y">
            {budgets.map((b) => (
              <BudgetRow
                key={b.id}
                budget={b}
                spent={spendByCategory[b.category_id] ?? 0}
                currency={profile?.base_currency}
                onEdit={(bud) => {
                  setEditing(bud);
                  setModalOpen(true);
                }}
                onDelete={setToDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) =>
          editing ? updateBudget(editing.id, payload) : addBudget(payload)
        }
        categories={editing ? categories : available}
        initial={editing}
      />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteBudget(toDelete.id)}
        title="Remove budget"
        description="This category will no longer have a monthly limit."
      />
    </AppShell>
  );
}
