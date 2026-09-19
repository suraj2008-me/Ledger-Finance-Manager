import { useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/layout/AppShell";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../hooks/useTransactions";
import { CURRENCIES } from "../lib/constants";
import { transactionsToCSV, downloadCSV } from "../lib/csv";

export default function Settings() {
  const { profile, updateProfile, user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { transactions } = useTransactions({});
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    base_currency: profile?.base_currency ?? "INR",
  });
  const [saving, setSaving] = useState(false);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateProfile(form);
    setSaving(false);
    if (!error) toast.success("Settings saved");
  };

  return (
    <AppShell title="Settings">
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-display text-lg text-ink-900 dark:text-paper">
            Profile
          </h2>
          <form
            onSubmit={onSave}
            className="space-y-4 rounded-md border border-hairline dark:border-hairline-dark p-6"
          >
            <Input label="Email" value={user?.email ?? ""} disabled />
            <Input
              label="Full name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <Select
              label="Base currency"
              value={form.base_currency}
              onChange={(e) =>
                setForm({ ...form, base_currency: e.target.value })
              }
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </Select>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg text-ink-900 dark:text-paper">
            Appearance
          </h2>
          <div className="flex items-center justify-between rounded-md border border-hairline dark:border-hairline-dark p-6">
            <div>
              <p className="text-sm text-ink-900 dark:text-paper">Dark mode</p>
              <p className="text-xs text-ink-400">
                Switch between light and dark ledger themes.
              </p>
            </div>
            <div className="flex gap-2">
              {["light", "dark"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded border px-3 py-1.5 text-sm capitalize ${
                    theme === t
                      ? "border-ledger-500 bg-ledger-50 text-ledger-700 dark:bg-ledger-900/40 dark:text-ledger-200"
                      : "border-hairline dark:border-hairline-dark text-ink-500 dark:text-ink-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg text-ink-900 dark:text-paper">
            Your data
          </h2>
          <div className="flex items-center justify-between rounded-md border border-hairline dark:border-hairline-dark p-6">
            <div>
              <p className="text-sm text-ink-900 dark:text-paper">
                Export everything
              </p>
              <p className="text-xs text-ink-400">
                Download all {transactions.length} entries as a CSV file.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                downloadCSV(
                  "ledgerly-all-data.csv",
                  transactionsToCSV(transactions),
                )
              }
            >
              Export CSV
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg text-rust-500">Account</h2>
          <div className="flex items-center justify-between rounded-md border border-hairline dark:border-hairline-dark p-6">
            <div>
              <p className="text-sm text-ink-900 dark:text-paper">Sign out</p>
              <p className="text-xs text-ink-400">
                End your session on this device.
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
