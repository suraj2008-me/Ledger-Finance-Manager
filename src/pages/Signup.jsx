import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.name);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(
      "Account created — check your email if confirmation is required.",
    );
    navigate("/");
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Start your money OS."
      description="Create one focused space for your accounts, spending, budgets and financial momentum."
      mode="signup"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-ledger-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Full name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Aditi Sharma"
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
        <PasswordInput
          label="Password"
          required
          minLength={6}
          showStrength
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="At least 6 characters"
        />
        <PasswordInput
          label="Confirm password"
          required
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          placeholder="Re-enter your password"
          error={
            form.confirmPassword && form.confirmPassword !== form.password
              ? "Passwords don't match"
              : undefined
          }
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
