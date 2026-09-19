import { useState } from "react";
import { Wallet, Plus } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import AccountCard from "../components/accounts/AccountCard";
import AccountModal from "../components/accounts/AccountModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { useAccounts } from "../hooks/useAccounts";
import { formatMoney } from "../lib/formatters";

export default function Accounts() {
  const { accounts, loading, addAccount, updateAccount, deleteAccount } =
    useAccounts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const total = accounts
    .filter((a) => a.type !== "credit_card")
    .reduce((sum, a) => sum + Number(a.balance), 0);
  const bankTotal = accounts
    .filter((a) => a.type === "bank")
    .reduce((sum, a) => sum + Number(a.balance), 0);
  const cashTotal = accounts
    .filter((a) => a.type === "cash")
    .reduce((sum, a) => sum + Number(a.balance), 0);

  return (
    <AppShell title="Accounts">
      <div className="">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Net across accounts", total],
            ["Bank balance", bankTotal],
            ["Cash in hand", cashTotal],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-md border border-hairline p-5 dark:border-hairline-dark"
            >
              <p className="text-sm text-ink-400">{label}</p>
              <p className="mt-1 font-display text-3xl text-ink-900 dark:text-paper">
                {formatMoney(value, accounts[0]?.currency ?? "INR")}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink-900 dark:text-paper">
            Your accounts
          </h2>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> Add account
          </Button>
        </div>

        {loading ? (
          <Spinner />
        ) : accounts.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No accounts yet"
            description="Add a bank account, wallet or card to start tracking balances."
            action={
              <Button onClick={() => setModalOpen(true)}>Add account</Button>
            }
          />
        ) : (
          <div className="rounded-md border border-hairline dark:border-hairline-dark px-6">
            {accounts.map((a) => (
              <AccountCard
                key={a.id}
                account={a}
                onEdit={(acc) => {
                  setEditing(acc);
                  setModalOpen(true);
                }}
                onDelete={setToDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AccountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) =>
          editing ? updateAccount(editing.id, payload) : addAccount(payload)
        }
        initial={editing}
      />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteAccount(toDelete.id)}
        title="Remove account"
        description="Its transactions will remain but lose their account link."
      />
    </AppShell>
  );
}
