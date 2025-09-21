import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@app/hooks";
import { useAuth } from "@app/hooks";
import { notify } from "@app/lib/toast";

type Props = {
  mode: "reset" | "verify"; // password reset OR confirmation
};

export default function TokenActionCard({ mode }: Props) {
  const [qs] = useSearchParams();
  const token = qs.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { getUserToken } = useUser();
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  async function handleAction() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!token) {
      setError("Token not found in query string");
      setLoading(false);
      return;
    }
    try {
      if (mode === "verify") {
        const result = await getUserToken(token);
        if (result) {
          setSuccess(true);
          notify.success("Account verified successfully, please log-in again");
          setTimeout(() => {
            navigate("/login");
          },1200);
        } else setError("Failed to verify account");
      } else if (mode === "reset") {
        if (!password || password !== confirm) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        await changePassword(password);
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          {mode == "reset" ? (
            <img
              src="/images/v-disk-password.png"
              className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
              loading="lazy"
              alt="v-disk paswword"
            />
          ) : (
            <img
              src="/images/v-disk-verify.png"
              className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
              loading="lazy"
              alt="v-disk verify"
            />
          )}
        </div>
        <div className="max-w-lg mx-auto border border-white/10 bg-black/60 p-6 md:p-8">
          <h1 className="font-display text-2xl uppercase tracking-wider mb-2">
            {mode === "reset" ? "Password Reset" : "Confirm Account"}
          </h1>
          <p className="text-sm text-white/70 mb-6">
            {mode === "reset"
              ? "Use the token sent by email to set your new password."
              : "Enter the token received by email to confirm your account."}
          </p>

          {/* Token */}
          <label className="block mb-4">
            <span className="text-xs text-white/60">Token</span>
            <pre className="mt-1 bg-black border border-white/20 text-xs text-white/80 p-2 overflow-auto">
              {token || "(token not found in query string)"}
            </pre>
          </label>

          {mode === "reset" && (
            <>
              <label className="block mb-3">
                <span className="text-xs text-white/60">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
                />
              </label>

              <label className="block mb-3">
                <span className="text-xs text-white/60">Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
                />
              </label>
            </>
          )}

          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          {success && (
            <div className="text-green-500 text-xs mb-2">
              {mode === "reset"
                ? "Password changed successfully!"
                : "Account successfully confirmed!"}
            </div>
          )}

          <button
            type="button"
            className="mt-4 w-full border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
            onClick={handleAction}
            disabled={loading}
          >
            {loading
              ? mode === "reset"
                ? "Changing..."
                : "Confirming..."
              : mode === "reset"
              ? "Change password"
              : "Confirm account"}
          </button>
        </div>
      </section>
    </>
  );
}
