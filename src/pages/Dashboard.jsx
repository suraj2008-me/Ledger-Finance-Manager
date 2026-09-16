import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import StatHero from '../components/dashboard/StatHero'
import MiniStat from '../components/dashboard/MiniStat'
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart'
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown'
import BudgetSummary from '../components/dashboard/BudgetSummary'
import TransactionRow from '../components/transactions/TransactionRow'
import TransactionModal from '../components/transactions/TransactionModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { useAccounts } from '../hooks/useAccounts'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'
import { useBudgets } from '../hooks/useBudgets'
import { formatMoney, monthLabel, startOfMonthISO, endOfMonthISO } from '../lib/formatters'

export default function Dashboard() {
  const { profile } = useAuth()
  const currency = profile?.base_currency ?? 'INR'
  const { accounts, loading: accountsLoading } = useAccounts()
  const { categories } = useCategories()
  const { budgets, spendByCategory } = useBudgets()

  const thisMonth = { from: startOfMonthISO(), to: endOfMonthISO() }
  const { transactions: monthTx, loading: txLoading } = useTransactions(thisMonth)
  const {
    transactions: recent,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions({ limit: 6 })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0)
  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = monthTx
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0)
  const net = income - expense

  const trendData = useMemo(() => {
    // Approximates recent months by holding the current balance flat before this
    // month's net change — a full history uses the date range picker on Reports.
    const months = []
    const now = new Date()
    const priorBalance = totalBalance - net
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        label: monthLabel(d),
        balance: i === 0 ? totalBalance : priorBalance,
      })
    }
    return months
  }, [totalBalance, net])

  const categoryData = useMemo(() => {
    const map = {}
    monthTx
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const name = t.categories?.name ?? 'Uncategorised'
        const color = t.categories?.color ?? '#6C766B'
        map[name] = map[name] || { name, color, value: 0 }
        map[name].value += Number(t.amount)
      })
    return Object.values(map).sort((a, b) => b.value - a.value)
  }, [monthTx])

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const loading = accountsLoading || txLoading

  return (
    <AppShell title="Overview" onQuickAdd={openNew}>
      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-md border border-hairline dark:border-hairline-dark p-6">
              <StatHero label="Total balance" amount={totalBalance} currency={currency} />
              <div className="mt-6">
                <BalanceTrendChart data={trendData} currency={currency} />
              </div>
            </div>
            <div className="rounded-md border border-hairline dark:border-hairline-dark p-6">
              <p className="mb-4 text-sm text-ink-400">This month</p>
              <div className="space-y-4">
                <MiniStat label="Income" value={formatMoney(income, currency)} tone="income" />
                <MiniStat label="Expenses" value={formatMoney(expense, currency)} tone="expense" />
                <MiniStat
                  label="Net saved"
                  value={formatMoney(net, currency, { signed: true })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-md border border-hairline dark:border-hairline-dark p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg text-ink-900 dark:text-paper">
                  Where it went
                </h2>
                <Link to="/reports" className="text-sm text-ledger-600 hover:underline">
                  Full report
                </Link>
              </div>
              <CategoryBreakdown data={categoryData} currency={currency} />
            </div>

            <div className="rounded-md border border-hairline dark:border-hairline-dark p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg text-ink-900 dark:text-paper">Budgets</h2>
                <Link to="/budgets" className="text-sm text-ledger-600 hover:underline">
                  Manage
                </Link>
              </div>
              <BudgetSummary
                budgets={budgets}
                spendByCategory={spendByCategory}
                currency={currency}
              />
            </div>
          </div>

          <div className="rounded-md border border-hairline dark:border-hairline-dark p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink-900 dark:text-paper">
                Recent entries
              </h2>
              <Link to="/transactions" className="text-sm text-ledger-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="hairline-y">
              {recent.length === 0 && (
                <p className="py-6 text-sm text-ink-400">No entries yet — add your first one.</p>
              )}
              {recent.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  onEdit={(t) => {
                    setEditing(t)
                    setModalOpen(true)
                  }}
                  onDelete={setToDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) =>
          editing ? updateTransaction(editing.id, payload) : addTransaction(payload)
        }
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
