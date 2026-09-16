import { useState } from 'react'
import { Tags, Plus } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import CategoryRow from '../components/categories/CategoryRow'
import CategoryModal from '../components/categories/CategoryModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { useCategories } from '../hooks/useCategories'

export default function Categories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const expense = categories.filter((c) => c.type === 'expense')
  const income = categories.filter((c) => c.type === 'income')

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  return (
    <AppShell title="Categories" onQuickAdd={openNew}>
      <div className="">
        {loading ? (
          <Spinner />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Create categories to group your income and expenses."
            action={<Button onClick={openNew}>Add category</Button>}
          />
        ) : (
          <div className="space-y-8">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-display text-lg text-ink-900 dark:text-paper">Expense</h2>
                <Button size="sm" variant="secondary" onClick={openNew}>
                  <Plus size={14} /> Add
                </Button>
              </div>
              <div className="rounded-md border border-hairline dark:border-hairline-dark px-6 hairline-y">
                {expense.map((c) => (
                  <CategoryRow
                    key={c.id}
                    category={c}
                    onEdit={(cat) => {
                      setEditing(cat)
                      setModalOpen(true)
                    }}
                    onDelete={setToDelete}
                  />
                ))}
                {expense.length === 0 && (
                  <p className="py-4 text-sm text-ink-400">No expense categories yet.</p>
                )}
              </div>
            </div>
            <div>
              <h2 className="mb-2 font-display text-lg text-ink-900 dark:text-paper">Income</h2>
              <div className="rounded-md border border-hairline dark:border-hairline-dark px-6 hairline-y">
                {income.map((c) => (
                  <CategoryRow
                    key={c.id}
                    category={c}
                    onEdit={(cat) => {
                      setEditing(cat)
                      setModalOpen(true)
                    }}
                    onDelete={setToDelete}
                  />
                ))}
                {income.length === 0 && (
                  <p className="py-4 text-sm text-ink-400">No income categories yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) =>
          editing ? updateCategory(editing.id, payload) : addCategory(payload)
        }
        initial={editing}
      />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteCategory(toDelete.id)}
        title="Remove category"
        description="Transactions using this category will become uncategorised."
      />
    </AppShell>
  )
}
