import { Search } from "lucide-react";
import Select from "../ui/Select";

export default function TransactionFilters({
  filters,
  setFilters,
  categories,
  accounts,
}) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[180px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
        />
        <input
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search notes…"
          className="w-full rounded border border-hairline dark:border-hairline-dark bg-transparent py-2 pl-9 pr-3 text-sm focus:border-ledger-500 focus:ring-1 focus:ring-ledger-500"
        />
      </div>
      <Select
        className="w-auto"
        value={filters.type ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, type: e.target.value || undefined })
        }
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="transfer">Transfer</option>
      </Select>
      <Select
        className="w-auto"
        value={filters.accountId ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, accountId: e.target.value || undefined })
        }
      >
        <option value="">All accounts</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </Select>
      <Select
        className="w-auto"
        value={filters.categoryId ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, categoryId: e.target.value || undefined })
        }
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <input
        type="date"
        value={filters.from ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, from: e.target.value || undefined })
        }
        className="rounded border border-hairline dark:border-hairline-dark bg-transparent px-2 py-2 text-sm"
      />
      <span className="text-ink-300">–</span>
      <input
        type="date"
        value={filters.to ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, to: e.target.value || undefined })
        }
        className="rounded border border-hairline dark:border-hairline-dark bg-transparent px-2 py-2 text-sm"
      />
    </div>
  );
}
