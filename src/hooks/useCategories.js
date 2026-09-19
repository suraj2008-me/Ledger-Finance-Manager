import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) toast.error(error.message);
    setCategories(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (payload) => {
    const { data, error } = await supabase
      .from("categories")
      .insert({ ...payload, user_id: user.id })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setCategories((prev) =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
    );
    toast.success("Category added");
    return { data };
  };

  const updateCategory = async (id, patch) => {
    const { data, error } = await supabase
      .from("categories")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? data : c)));
    toast.success("Category updated");
    return { data };
  };

  const deleteCategory = async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return { error };
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category removed");
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh: fetchCategories,
  };
}
