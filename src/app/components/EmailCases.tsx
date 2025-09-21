import { useState } from "react";
import { notify } from "@app/lib/toast";
import { useEmail } from "@app/hooks";

type Props = {
  to?: string; 
};

export function EmailSentSuccess({ to }: Props) {
  const { sendEmail } = useEmail();
  const [sending, setSending] = useState(false);

  async function handleResend() {
    if (!to) {
      notify.error("No recipient specified for resend");
      return;
    }
    setSending(true);
    try {
      await sendEmail({ to, subject: "Verify your account", template: "verify" } as any);
      notify.success("Email resent successfully!");
    } catch (e: any) {
      notify.error("Failed to resend email");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="w-full max-w-md border border-green-400/30 bg-green-500/10 p-6 md:p-8 text-center">
      <img src="/images/v-disk-punk.png" alt="V-Disk Punk" className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover" />
      <h2 className="text-green-300 font-semibold text-lg">Email sent!</h2>
      <p className="mt-2 text-sm text-green-200/80">
        Check your inbox and follow the instructions we sent to verify your email.
      </p>
      <div className="mt-4">
        <button
          className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest"
          onClick={handleResend}
          disabled={sending}
        >
          {sending ? "Resending..." : "Resend Email"}
        </button>
      </div>
    </div>
  );
}

export function EmailSentError({ to }: Props) {
  const { sendEmail } = useEmail();
  const [sending, setSending] = useState(false);

  async function handleResend() {
    if (!to) {
      notify.error("No recipient specified for resend");
      return;
    }
    setSending(true);
    try {
      await sendEmail({ to, subject: "Verify your account", template: "verify" } as any);
      notify.success("Email resent successfully!");
    } catch (e: any) {
      notify.error("Failed to resend email");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="w-full max-w-md border border-red-400/30 bg-red-500/10 p-6 md:p-8 text-center">
      <img src="/images/v-disk-punk.png" alt="V-Disk Punk" className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover" />
      <h2 className="text-red-300 font-semibold text-lg">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-200/80">
        We couldn’t send the email. Please try again shortly.
      </p>
      <button
        className="mt-4 border border-red-400/50 hover:border-red-300 text-red-300 px-4 py-2 text-xs uppercase tracking-widest"
        onClick={handleResend}
        disabled={sending}
      >
        {sending ? "Resending..." : "Resend Email"}
      </button>
    </div>
  );
}

