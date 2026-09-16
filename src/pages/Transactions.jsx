import { useState } from 'react'
import { Download, ArrowLeftRight } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionRow from '../components/transactions/TransactionRow'
import TransactionModal from '../components/transactions/TransactionModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { useAccounts } from '../hooks/useAccounts'
import { transactionsToCSV, downloadCSV } from '../lib/csv'

export default function Transactions() {
  const [filters, setFilters] = useState({})
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions(filters)
  const { categories } = useCategories()
  const { accounts } = useAccounts()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (tx) => {
    setEditing(tx)
    setModalOpen(true)
  }

  const handleSave = (payload) =>
    editing ? updateTransaction(editing.id, payload) : addTransaction(payload)

  const grouped = transactions.reduce((acc, tx) => {
    const key = tx.date
    acc[key] = acc[key] || []
    acc[key].push(tx)
    return acc
  }, {})

  return (
    <AppShell title="Transactions" onQuickAdd={openNew}>
      <div className="">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <TransactionFilters
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            accounts={accounts}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => downloadCSV('ledgerly-transactions.csv', transactionsToCSV(transactions))}
          >
            <Download size={14} /> Export CSV
          </Button>
        </div>

        {loading ? (
          <Spinner />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No entries yet"
            description="Add your first income or expense to start the ledger."
            action={<Button onClick={openNew}>Add entry</Button>}
          />
        ) : (
          <div className="rounded-md border border-hairline dark:border-hairline-dark px-6">
            {Object.entries(grouped).map(([date, rows]) => (
              <div key={date} className="hairline-y">
                <p className="pt-4 text-xs uppercase tracking-wide text-ink-300">
                  {new Date(date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })}
                </p>
                <div className="hairline-y">
                  {rows.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      onEdit={openEdit}
                      onDelete={setToDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        accounts={accounts}
        initial={editing}
      />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteTransaction(toDelete.id)}
        title="Delete entry"
        description="This entry will be permanently removed from your ledger."
      />
    </AppShell>
  )
}
