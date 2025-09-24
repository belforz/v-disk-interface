import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useEmail } from "@app/hooks";
import { notify } from "@app/lib/toast";

export default function ForgotPasswordPage() {
  const { emailChangePassword, loading, error } = useEmail();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emailChangePassword(email);
      setEmail("");
      navigate("/login");
    } catch (error) {
      notify.error("Failed to send password reset email.");
    }
  };

  return (
    <section className="w-full max-w-md border border-white/10 bg-black/60 p-5 md:p-6 rounded-none">
      <div className="w-full max-w-md border border-white/10 bg-black/60 p-6 md:p-8">
        <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider text-center">
          Forgot Password
        </h1>
        <p className="mt-3 text-white/70 text-center text-sm">
          Enter your email and we’ll send you instructions to reset your password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs text-white/60">E-mail</span>
            <input
              type="email"
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="w-full border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
          >
            Send Reset Link
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] text-white/50 uppercase tracking-widest">
            or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-2">
          <Link to="/">
            <button
              type="button"
              className="w-full border border-white/20 hover:border-white/50 py-2 text-[11px] uppercase tracking-widest"
            >
              Back to Home
            </button>
          </Link>
        </div>

        <p className="mt-5 text-center text-[11px] text-white/60">
          Still need help?{" "}
          <a
            href="mailto:macedobeiramar@hotmail.com"
            className="underline hover:text-white"
          >
            Contact Support
          </a>
        </p>
      </div>
    </section>
  );
}
