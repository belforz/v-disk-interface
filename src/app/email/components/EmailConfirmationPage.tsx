import { useState } from "react";
import EmailConfirmResult from "@app/components/EmailResults";
import { useUser } from "@app/hooks";

function EmailCodeForm({
  emailHint,
  onSubmit,
  onResend,
  loading,
}: {
  emailHint?: string;
  onSubmit: (code: string) => void;
  onResend?: () => void;
  loading?: boolean;
}) {
  const [code, setCode] = useState("");

  return (
    <form className="w-full max-w-md border border-white/10 bg-black/60 p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); onSubmit(code); }}>
      <h1 className="font-display text-2xl uppercase tracking-wider text-center">Verify your email</h1>
      <p className="mt-3 text-white/70 text-center text-sm">Enter the code we sent to <strong>{emailHint}</strong></p>

      <div className="mt-6 space-y-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          type="text"
          maxLength={6}
          className="tracking-[0.5em] text-center text-lg bg-black border border-white/20 w-full px-3 py-2 outline-none focus:border-white/50"
          placeholder="••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="text-center text-xs text-white/60">
          <button type="button" onClick={onResend} className="underline">Resend code</button>
        </div>
      </div>
    </form>
  );
}

export default function EmailConfirmPage() {
  const [view, setView] = useState<"form" | "success" | "error">("form");
  const { getUserToken, loading } = useUser();

  async function handleSubmit(code: string) {
    try {
      const result = await getUserToken(code);
      if (result) setView("success");
      else setView("error");
    } catch (e) {
      setView("error");
    }
  }

  function handleResend() {
    // resend flows are handled elsewhere; show feedback view
    setView("error");
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-16">
      {view === "form" && (
        <EmailCodeForm emailHint="you@example.com" onSubmit={handleSubmit} onResend={handleResend} loading={loading} />
      )}

      {view === "success" && <EmailConfirmResult status="success" />}

      {view === "error" && (
        <EmailConfirmResult status="error" onRetry={() => setView("form")} />
      )}
    </main>
  );
}
