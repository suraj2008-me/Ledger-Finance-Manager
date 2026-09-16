import { useMemo, useState } from 'react'
import { Repeat, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import AppShell from '../components/layout/AppShell'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import IconBadge from '../components/ui/IconBadge'
import { useTransactions } from '../hooks/useTransactions'
import { formatDate, formatMoney, todayISO } from '../lib/formatters'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

function addInterval(dateStr, recurrence) {
  const d = new Date(dateStr)
  if (recurrence === 'daily') d.setDate(d.getDate() + 1)
  if (recurrence === 'weekly') d.setDate(d.getDate() + 7)
  if (recurrence === 'monthly') d.setMonth(d.getMonth() + 1)
  if (recurrence === 'yearly') d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export default function Recurring() {
  const { user } = useAuth()
  const { transactions, loading, refresh } = useTransactions({})
  const [running, setRunning] = useState(false)

  const recurring = useMemo(
    () => transactions.filter((t) => t.recurrence && t.recurrence !== 'none'),
    [transactions]
  )

  const due = recurring.filter((t) => t.date <= todayISO())

  const runDue = async () => {
    setRunning(true)
    let created = 0
    for (const t of due) {
      const nextDate = addInterval(t.date, t.recurrence)
      const { error: insertErr } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: t.type,
        amount: t.amount,
        date: nextDate,
        category_id: t.category_id,
        account_id: t.account_id,
        note: t.note,
        recurrence: 'none',
      })
      if (!insertErr) {
        created += 1
        await supabase.from('transactions').update({ date: nextDate }).eq('id', t.id)
      }
    }
    setRunning(false)
    if (created > 0) {
      toast.success(`Created ${created} due entr${created === 1 ? 'y' : 'ies'}`)
      refresh()
    } else {
      toast('No entries were due', { icon: 'ℹ️' })
    }
  }

  return (
    <AppShell title="Recurring">
      <div className="">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-ink-400">
            {due.length > 0
              ? `${due.length} entr${due.length === 1 ? 'y is' : 'ies are'} due today or earlier`
              : 'Everything is up to date'}
          </p>
          <Button size="sm" onClick={runDue} disabled={running || due.length === 0}>
            <Play size={14} /> Run due entries
          </Button>
        </div>

        {loading ? (
          <Spinner />
        ) : recurring.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="Nothing set to repeat"
            description="Mark an entry as repeating from the transaction form to see it here."
          />
        ) : (
          <div className="rounded-md border border-hairline dark:border-hairline-dark px-6 hairline-y">
            {recurring.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <IconBadge color={t.categories?.color ?? '#6C766B'} label={t.categories?.name ?? t.type} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-900 dark:text-paper">
                    {t.note || t.categories?.name || 'Entry'}
                  </p>
                  <p className="text-xs text-ink-400 capitalize">
                    {t.recurrence} · next on {formatDate(t.date)}
                  </p>
                </div>
                <span className="tabular text-sm text-ink-900 dark:text-paper">
                  {formatMoney(t.amount, t.accounts?.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
