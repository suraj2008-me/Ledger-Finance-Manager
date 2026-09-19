import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center px-6">
      <p className="font-display text-4xl text-ink-900 dark:text-paper">
        Page not found
      </p>
      <p className="text-sm text-ink-400">
        This entry doesn't exist in the ledger.
      </p>
      <Button as={Link} to="/" className="mt-2">
        Back to overview
      </Button>
    </div>
  );
}
