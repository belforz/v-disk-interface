import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import ForgotPasswordPage from "../login/ForgetPassword";
import { useAuth } from "@app/hooks";
import { useCartFacade } from "@app/hooks/useCartFacade";
import StatusHandler from "./StatusHandler";
import { useNavigate } from "react-router-dom";
import { notify } from "@app/lib/toast";

export function LogInSection() {
  const [forgetPassword, setForgetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { auth, loading, error, logout, user, token } = useAuth();
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    setShowErrorOverlay(Boolean(error));
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await auth(email, password);
      if (result?.user) {
        // Guest cart merging removed; no action required after login

        if (Array.isArray(result.user.roles) && result.user.roles.includes("ADMIN")) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        
        notify.error("Login failed: no user information received");
      }
    } catch (err: any) {
      // auth throws sanitized ApiError now; show friendly message
      notify.error(err?.message || "Login failed");
      setShowErrorOverlay(true);
    }
  }

  if (forgetPassword) {
    return <ForgotPasswordPage />;
  }
  return (
    <>
      <div className="relative">
        {showErrorOverlay && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-w-md w-full bg-neutral-900 border border-white/10 p-4 rounded">
              <StatusHandler error={error} />
              <div className="mt-3 text-right">
                <button
                  type="button"
                  className="px-3 py-1 text-sm border border-white/20"
                  onClick={() => setShowErrorOverlay(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="w-full max-w-md border border-white/10 bg-black/60 p-5 md:p-6 rounded-none">
          <h2 className="flex justify-center text-sm uppercase tracking-widest text-white/80 mb-4">
            Log in
          </h2>

          <div className="flex items-start">
            <h2 className="text-xs text-white/60">Email</h2>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
                required
              />
            </label>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[11px] text-white/60 hover:text-white/90 underline underline-offset-4"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-white/80"
                />
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
              type="submit"
              className="w-full mt-2 border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
              disabled={loading}
            >
              {loading ? "Trying..." : "Log in"}
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
      </div>
    </>
  );
}
