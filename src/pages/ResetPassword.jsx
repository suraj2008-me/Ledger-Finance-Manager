import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (password !== confirm) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated — you're all set.");
    navigate("/");
  };

  return (
    <AuthLayout
      eyebrow="Reset password"
      title="Choose a new password."
      description="You followed a reset link — pick something new and you'll be signed straight in."
      mode="signup"
      footer={
        <span className="text-ink-400 dark:text-ink-500">
          Trouble with this link? Request a new one from the login page.
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <PasswordInput
          label="New password"
          required
          minLength={6}
          showStrength
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        <PasswordInput
          label="Confirm new password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter your new password"
          error={
            confirm && confirm !== password ? "Passwords don't match" : undefined
          }
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
