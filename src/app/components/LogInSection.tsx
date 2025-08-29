import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ForgotPasswordPage from "./ForgetPassword";

export function LogInSection() {
  const [forgetPassword, setForgetPassword] = useState(false);

  if (forgetPassword) {
    return <ForgotPasswordPage />;
  }
  return (
    <>
      <section className="w-full max-w-md border border-white/10 bg-black/60 p-5 md:p-6 rounded-none">
        <h2 className="text-sm uppercase tracking-widest text-white/80 mb-4">
          Log in
        </h2>

        <div className="flex items-start">
          <h2 className="text-xs text-white/60">Email</h2>
        </div>
        <form className="space-y-3">
          <label className="block">
            <input
              type="email"
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              required
            />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Password</span>
              <button
                type="button"
                className="text-[11px] text-white/60 hover:text-white/90 underline underline-offset-4"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>
            <input
              type="password"
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-xs text-white/70">
              <input type="checkbox" className="h-3.5 w-3.5 accent-white/80" />
              Remember me
            </label>

            <button
              className="text-xs text-white/70 hover:text-white underline underline-offset-4"
              onClick={() => setForgetPassword(true)}
            >
              Forgot my password
            </button>
          </div>

          <button
            type="button"
            className="w-full mt-2 border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
          >
            Log in
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] text-white/50 uppercase tracking-widest">
            or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="border border-white/20 hover:border-white/50 py-2 text-[11px] uppercase tracking-widest"
          >
            Google
          </button>
          <button
            type="button"
            className="border border-white/20 hover:border-white/50 py-2 text-[11px] uppercase tracking-widest"
          >
            Apple
          </button>
        </div>

        <div className="mt-5 text-[11px] text-white/60 text-center">
          By continuing you agree to our{" "}
          <a href="#" className="underline hover:text-white">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-white">
            Privacy Policy
          </a>
          .
        </div>
      </section>
    </>
  );
}
