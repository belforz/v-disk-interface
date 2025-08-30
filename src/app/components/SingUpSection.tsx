import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export function SignUpSection() {
  return (
    <>
      <section className="w-full max-w-md border border-white/10 bg-black/60 p-5 md:p-6 rounded-none">
        <h2 className="flex justify-center text-sm uppercase tracking-widest text-white/80 mb-4">
          Sign Up
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

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Full Name</span>
            </div>
            <input
              type="text"
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              required
              maxLength={100}
            />
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

          <div className="flex flex-col justify-center">
            <button
              type="button"
              className="w-full border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
            >
              Submit
            </button>

            <Link to="/">
              <button
                type="button"
                className="w-full mt-2 border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
