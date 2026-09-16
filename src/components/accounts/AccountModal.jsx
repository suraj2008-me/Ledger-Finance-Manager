import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { ACCOUNT_TYPES, CURRENCIES } from '../../lib/constants'

const empty = { name: '', type: 'bank', opening_balance: '', currency: 'INR' }

export default function AccountModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) setForm(initial ? { ...empty, ...initial } : empty)
  }, [open, initial])

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, opening_balance: Number(form.opening_balance || 0) }
    const { error } = await onSave(payload)
    if (!error) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit account' : 'New account'}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Account name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="HDFC Savings"
        />
        <Select
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-3">
          {!initial && (
            <Input
              label="Opening balance"
              type="number"
              step="0.01"
              value={form.opening_balance}
              onChange={(e) => setForm({ ...form, opening_balance: e.target.value })}
              placeholder="0.00"
            />
          )}
          <Select
            label="Currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </Select>
        </div>
        {initial && (
          <p className="text-xs text-ink-400">
            Balance updates automatically from your transactions.
          </p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save account</Button>
        </div>
      </form>
    </Modal>
  )
}
