import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SELECT =
  "*, given_account:accounts!loans_account_id_fkey(id,name,type,currency), repayment_account:accounts!loans_repayment_account_id_fkey(id,name,type,currency)";

export function useLoans(filters = {}) {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(filters);

  const fetchLoans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("loans")
      .select(SELECT)
      .order("status", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false });
    if (filters.status) query = query.eq("status", filters.status);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    setLoans(data ?? []);
    setLoading(false);
  }, [user, key]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const addLoan = async (payload) => {
    const { data, error } = await supabase
      .from("loans")
      .insert({ ...payload, user_id: user.id })
      .select(SELECT)
      .single();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setLoans((prev) =>
      [...prev, data].sort(
        (a, b) =>
          (a.status === "pending" ? -1 : 1) - (b.status === "pending" ? -1 : 1),
      ),
    );
    toast.success("Loan recorded");
    return { data };
  };

  const updateLoan = async (id, patch) => {
    const { data, error } = await supabase
      .from("loans")
      .update(patch)
      .eq("id", id)
      .select(SELECT)
      .single();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setLoans((prev) => prev.map((l) => (l.id === id ? data : l)));
    toast.success("Loan updated");
    return { data };
  };

  const deleteLoan = async (id) => {
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setLoans((prev) => prev.filter((l) => l.id !== id));
    toast.success("Loan removed");
  };

  const markRepaid = async (id, amount) =>
    updateLoan(id, { repaid_amount: Number(amount) });

  return {
    loans,
    loading,
    addLoan,
    updateLoan,
    deleteLoan,
    markRepaid,
    refresh: fetchLoans,
  };
}
