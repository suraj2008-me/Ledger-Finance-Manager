import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate("/");
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Welcome back."
      description="Your financial dashboard is waiting. Sign in to keep your accounts, budgets and spending in sync."
      mode="login"
      footer={
        <>
          New to Ledger?{" "}
          <Link to="/signup" className="text-ledger-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
        <div>
          <PasswordInput
            label="Password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          <div className="mt-2 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-ledger-600 hover:underline dark:text-ledger-300"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
