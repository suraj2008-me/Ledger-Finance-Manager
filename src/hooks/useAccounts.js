import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useAccounts() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) toast.error(error.message)
    setAccounts(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const addAccount = async (payload) => {
    const { data, error } = await supabase
      .from('accounts')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()
    if (error) {
      toast.error(error.message)
      return { error }
    }
    setAccounts((prev) => [...prev, data])
    toast.success('Account added')
    return { data }
  }

  const updateAccount = async (id, patch) => {
    const { data, error } = await supabase
      .from('accounts')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      toast.error(error.message)
      return { error }
    }
    setAccounts((prev) => prev.map((a) => (a.id === id ? data : a)))
    toast.success('Account updated')
    return { data }
  }

  const deleteAccount = async (id) => {
    const { error } = await supabase.from('accounts').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
      return { error }
    }
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    toast.success('Account removed')
  }

  return { accounts, loading, addAccount, updateAccount, deleteAccount, refresh: fetchAccounts }
}
