import { useState } from "react";
import { useUser } from "@app/hooks";
import { useEmail } from "@app/hooks";
import { notify } from "@app/lib/toast";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [emailForResend, setEmailForResend] = useState("");
  const { getUserToken, loading } = useUser();
  const { sendEmail } = useEmail();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await getUserToken(code);
      if (result) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  async function handleResend(e?: React.MouseEvent) {
    e?.preventDefault();
    const to = emailForResend || undefined;
    if (!to) {
      notify.error("Please provide an email to resend the code");
      return;
    }
    try {
      await sendEmail({ to, subject: "Verify your account", template: "verify" } as any);
      notify.success("Verification email resent");
    } catch (err) {
      notify.error("Failed to resend verification email");
    }
  }

  return (
    <section className="grid place-items-center px-4 py-16">
      <img
        src="/images/v-disk-email.png"
        className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
        loading="lazy"
        alt="v-disk login"
      />
      <div className="w-full max-w-md border border-white/10 bg-black/60 p-6 md:p-8">
        <h1 className="font-display text-2xl uppercase tracking-wider text-center">
          Verify your email
        </h1>
        <p className="mt-3 text-white/70 text-center text-sm">
          Enter the code we sent to your email to confirm your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
        </form>

        <p className="mt-5 text-center text-xs text-white/60">
          Didn’t get the code? Provide email below to resend.
        </p>

        <div className="mt-3">
          <input
            type="email"
            value={emailForResend}
            onChange={(e) => setEmailForResend(e.target.value)}
            placeholder="your@email.com"
            className="mt-2 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
          />
          <div className="mt-2">
            <button
              onClick={handleResend}
              className="w-full border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
            >
              Resend
            </button>
          </div>
        </div>

        {status === "success" && <div className="mt-4 text-green-300">Email verified successfully.</div>}
        {status === "error" && <div className="mt-4 text-red-300">Verification failed. Try again.</div>}
      </div>
    </section>
  );
}
