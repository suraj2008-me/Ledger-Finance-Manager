import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { startOfMonthISO, endOfMonthISO } from '../lib/formatters'
import toast from 'react-hot-toast'

export function useBudgets() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [spendByCategory, setSpendByCategory] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [{ data: budgetRows, error: bErr }, { data: txRows, error: tErr }] = await Promise.all([
      supabase.from('budgets').select('*, categories(id,name,color)'),
      supabase
        .from('transactions')
        .select('category_id, amount, type, date')
        .eq('type', 'expense')
        .gte('date', startOfMonthISO())
        .lte('date', endOfMonthISO()),
    ])
    if (bErr) toast.error(bErr.message)
    if (tErr) toast.error(tErr.message)

    const spend = {}
    ;(txRows ?? []).forEach((t) => {
      spend[t.category_id] = (spend[t.category_id] ?? 0) + Number(t.amount)
    })

    setBudgets(budgetRows ?? [])
    setSpendByCategory(spend)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const addBudget = async (payload) => {
    const { data, error } = await supabase
      .from('budgets')
      .insert({ ...payload, user_id: user.id })
      .select('*, categories(id,name,color)')
      .single()
    if (error) {
      toast.error(error.message)
      return { error }
    }
    setBudgets((prev) => [...prev, data])
    toast.success('Budget set')
    return { data }
  }

  const updateBudget = async (id, patch) => {
    const { data, error } = await supabase
      .from('budgets')
      .update(patch)
      .eq('id', id)
      .select('*, categories(id,name,color)')
      .single()
    if (error) {
      toast.error(error.message)
      return { error }
    }
    setBudgets((prev) => prev.map((b) => (b.id === id ? data : b)))
    toast.success('Budget updated')
    return { data }
  }

  const deleteBudget = async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
      return { error }
    }
    setBudgets((prev) => prev.filter((b) => b.id !== id))
    toast.success('Budget removed')
  }

  return {
    budgets,
    spendByCategory,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    refresh: fetchAll,
  }
}
