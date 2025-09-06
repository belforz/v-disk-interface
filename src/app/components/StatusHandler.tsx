import { ReactNode } from "react";
import { Loader2, AlertCircle } from "lucide-react"; 
import { ApiError } from "@app/types";

type Props = {
  loading?: boolean;
  error?: string | ApiError | null;
  children?: ReactNode;
  onRetry?: () => void;
};

export default function StatusHandler({ loading, error, children, onRetry }: Props) {
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-white/70" />
        <span className="text-xs uppercase tracking-widest text-white/70">
          Loading...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <div className="flex items-center justify-center gap-2 mb-3 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">
            {typeof error === "string"
              ? error
              : error && typeof error === "object" && "message" in error
              ? (error as ApiError).message
              : "An unknown error occurred."}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry ?? (() => window.location.reload())}
          className="border border-red-400/50 hover:border-red-300 text-red-300 px-4 py-2 text-xs uppercase tracking-widest"
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
