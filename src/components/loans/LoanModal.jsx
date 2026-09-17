import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { todayISO } from '../../lib/formatters'

const empty = { person_name: '', amount: '', date: todayISO(), due_date: '', account_id: '', repayment_account_id: '', note: '', repaid_amount: 0 }

export default function LoanModal({ open, onClose, onSave, accounts, initial }) {
  const [form, setForm] = useState(empty)
  useEffect(() => { if (open) setForm(initial ? { ...empty, ...initial } : empty) }, [open, initial])
  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.account_id) return
    const repaidAmount = Number(form.repaid_amount || 0)
    if (repaidAmount > 0 && !form.repayment_account_id) return
    const payload = { person_name: form.person_name.trim(), amount: Number(form.amount), date: form.date, due_date: form.due_date || null, account_id: form.account_id, repayment_account_id: form.repayment_account_id || null, note: form.note.trim(), repaid_amount: repaidAmount }
    const { error } = await onSave(payload)
    if (!error) onClose()
  }
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit loan' : 'Give a loan'}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Person / friend" required value={form.person_name} onChange={(e) => setForm({ ...form, person_name: e.target.value })} placeholder="Rahul" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Amount" type="number" min="0.01" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000" />
          <Select label="Paid from" required value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })}>
            <option value="">Select account</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Given on" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Due date" type="date" value={form.due_date || ''} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
        </div>
        {initial && <div className="grid grid-cols-2 gap-3"><Input label="Amount repaid" type="number" min="0" max={form.amount || undefined} step="0.01" value={form.repaid_amount} onChange={(e) => setForm({ ...form, repaid_amount: e.target.value })} /><Select label="Received into" required={Number(form.repaid_amount || 0) > 0} value={form.repayment_account_id || ''} onChange={(e) => setForm({ ...form, repayment_account_id: e.target.value })}><option value="">Select account</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></div>}
        <Input label="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Personal loan" />
        <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save loan</Button></div>
      </form>
    </Modal>
  )
}
