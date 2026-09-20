import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  return (
    <AuthLayout
      eyebrow="Reset password"
      title="Forgot your password?"
      description="Enter the email on your account and we'll send you a link to set a new one."
      mode="login"
      footer={
        <>
          Remembered it after all?{" "}
          <Link to="/login" className="text-ledger-600 hover:underline">
            Back to log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="flex items-start gap-3 rounded-xl border border-ledger-200 bg-ledger-50 px-4 py-4 text-sm text-ledger-700 dark:border-ledger-500/20 dark:bg-ledger-500/10 dark:text-ledger-300">
          <MailCheck size={18} className="mt-0.5 shrink-0" />
          <p>
            If an account exists for <strong>{email}</strong>, a reset link
            is on its way. It can take a few minutes to arrive — don't
            forget to check spam.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
