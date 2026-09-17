import { useMemo, useState } from "react";
import { HandCoins, Plus, Pencil, Trash2, SquareCheck } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import LoanModal from "../components/loans/LoanModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { useLoans } from "../hooks/useLoans";
import { useAccounts } from "../hooks/useAccounts";
import { formatMoney } from "../lib/formatters";

export default function Loans() {
  const { loans, loading, addLoan, updateLoan, deleteLoan } = useLoans();
  const { accounts } = useAccounts();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const pending = useMemo(
    () =>
      loans.reduce(
        (s, l) => s + Math.max(0, Number(l.amount) - Number(l.repaid_amount)),
        0,
      ),
    [loans],
  );
  const currency = accounts[0]?.currency ?? "INR";
  const save = (payload) =>
    editing ? updateLoan(editing.id, payload) : addLoan(payload);
  return (
    <AppShell
      title="Loans & Credits"
      onQuickAdd={() => {
        setEditing(null);
        setOpen(true);
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-ink-400">Total amount still pending</p>
            <p className="font-display text-4xl text-ink-900 dark:text-paper">
              {formatMoney(pending, currency)}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus size={14} /> Give a loan
          </Button>
        </div>
        {loading ? (
          <Spinner />
        ) : loans.length === 0 ? (
          <EmptyState
            icon={HandCoins}
            title="No loans yet"
            description="Record money you have given to friends or other people and track what is still pending."
            action={<Button onClick={() => setOpen(true)}>Give a loan</Button>}
          />
        ) : (
          <div className="overflow-hidden rounded-md border border-hairline dark:border-hairline-dark">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 border-b border-hairline bg-ink-50 px-5 py-3 text-xs uppercase tracking-wide text-ink-400 dark:border-hairline-dark dark:bg-ink-800 md:grid">
              <span>Person</span>
              <span>Given</span>
              <span>Pending</span>
              <span>Due</span>
              <span />
            </div>
            {loans.map((loan) => {
              const pendingAmount = Math.max(
                0,
                Number(loan.amount) - Number(loan.repaid_amount),
              );
              return (
                <div
                  key={loan.id}
                  className="grid gap-3 border-b border-hairline px-5 py-4 last:border-b-0 dark:border-hairline-dark md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900 dark:text-paper">
                      {loan.person_name}
                    </p>
                    <p className="text-xs text-ink-400">
                      Given from {loan.given_account?.name ?? "Account removed"}{" "}
                      · {loan.date}
                    </p>
                    {loan.repaid_amount > 0 && (
                      <p className="text-xs text-ink-400">
                        Received in{" "}
                        {loan.repayment_account?.name ?? "Account removed"}
                      </p>
                    )}
                  </div>
                  <span className="text-sm tabular text-ink-700 dark:text-ink-200">
                    {formatMoney(
                      loan.amount,
                      loan.given_account?.currency ?? currency,
                    )}
                  </span>
                  <span
                    className={`text-sm tabular ${pendingAmount ? "text-rust-500" : "text-ledger-600"}`}
                  >
                    {pendingAmount
                      ? formatMoney(
                          pendingAmount,
                          loan.given_account?.currency ?? currency,
                        )
                      : "Paid"}
                  </span>
                  <span className="text-sm text-ink-500">
                    {loan.due_date || "—"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      title="Edit"
                      onClick={() => {
                        setEditing(loan);
                        setOpen(true);
                      }}
                      className="rounded p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700"
                    >
                      <Pencil size={14} />
                    </button>
                    {pendingAmount > 0 && (
                      <button
                        title="Mark fully repaid"
                        onClick={() => {
                          setEditing(loan);
                          setOpen(true);
                        }}
                        className="rounded p-1.5 text-ink-400 hover:bg-ledger-50 hover:text-ledger-600"
                      >
                        <SquareCheck size={14} />
                      </button>
                    )}
                    <button
                      title="Delete"
                      onClick={() => setToDelete(loan)}
                      className="rounded p-1.5 text-ink-400 hover:bg-rust-50 hover:text-rust-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <LoanModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={save}
        accounts={accounts}
        initial={editing}
      />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteLoan(toDelete.id)}
        title="Delete loan"
        description="This removes the loan record and reverses both the original account debit and any repayment account credit."
      />
    </AppShell>
  );
}
