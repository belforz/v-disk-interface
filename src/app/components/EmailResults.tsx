import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  status: "success" | "error";
  onRetry?: () => void; 
};

export default function EmailConfirmResult({ status, onRetry }: Props) {
  const isSuccess = status === "success";

  return (
    <div
      className={[
        "w-full max-w-md p-6 md:p-8 text-center border",
        isSuccess
          ? "border-emerald-400/30 bg-emerald-500/10"
          : "border-red-400/30 bg-red-500/10"
      ].join(" ")}
    >
      <div className="flex items-center justify-center gap-3">
        {isSuccess ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-300" />
        ) : (
          <XCircle className="h-6 w-6 text-red-300" />
        )}
        <h2 className={isSuccess ? "text-emerald-300 font-semibold text-lg" : "text-red-300 font-semibold text-lg"}>
          {isSuccess ? "Email verified!" : "Verification failed"}
        </h2>
      </div>

      <p className="mt-2 text-sm text-white/80">
        {isSuccess
          ? "Your email has been confirmed. You can now access your account."
          : "We couldn't verify your code. Please try again or request a new one."}
      </p>

      {isSuccess ? (
        <div className="mt-5 grid gap-2">
          <Link
            to="/auth/login"
            className="border border-emerald-400/40 hover:border-emerald-300 text-emerald-200 px-4 py-2 text-xs uppercase tracking-widest inline-block"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={onRetry}
            className="border border-red-400/50 hover:border-red-300 text-red-300 px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
