import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Two foreign keys now point from transactions -> accounts (account_id and
// to_account_id), so each embed must be disambiguated with its constraint
// name, and the destination side is aliased to `to_account`.
const SELECT =
  "*, categories(id,name,color,type), " +
  "accounts:accounts!transactions_account_id_fkey(id,name,type,currency), " +
  "to_account:accounts!transactions_to_account_id_fkey(id,name,type,currency)";

export function useTransactions(filters = {}) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const key = JSON.stringify(filters);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("transactions")
      .select(SELECT)
      .order("date", { ascending: false });

    if (filters.from) query = query.gte("date", filters.from);
    if (filters.to) query = query.lte("date", filters.to);
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.accountId) query = query.eq("account_id", filters.accountId);
    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
    if (filters.search) query = query.ilike("note", `%${filters.search}%`);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) toast.error(error.message);
    setTransactions(data ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, key]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (payload) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert({ ...payload, user_id: user.id })
      .select(SELECT)
      .single();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setTransactions((prev) => [data, ...prev]);
    toast.success("Transaction saved");
    return { data };
  };

  const updateTransaction = async (id, patch) => {
    // Transaction reads include joined `categories` / `accounts` /
    // `to_account` objects. Never send those relation objects back to
    // PostgREST as transaction columns; only the actual transactions-table
    // fields belong in `update`.
    const {
      categories: _categories,
      accounts: _accounts,
      to_account: _toAccount,
      id: _id,
      user_id: _userId,
      created_at: _createdAt,
      ...transactionPatch
    } = patch;

    const { data, error } = await supabase
      .from("transactions")
      .update(transactionPatch)
      .eq("id", id)
      .select(SELECT)
      .single();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
    toast.success("Transaction updated");
    return { data };
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transaction deleted");
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: fetchTransactions,
  };
}
