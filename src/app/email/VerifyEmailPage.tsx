export default function VerifyEmailPage() {
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

        <form className="mt-6 space-y-4">
          <input
            type="text"
            maxLength={6}
            className="tracking-[0.5em] text-center text-lg bg-black border border-white/20 w-full px-3 py-2 outline-none focus:border-white/50"
            placeholder="••••••"
          />

          <button
            type="submit"
            className="w-full border border-white/20 hover:border-white/50 py-2 text-xs uppercase tracking-widest"
          >
            Verify Email
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/60">
          Didn’t get the code?{" "}
          <a href="#" className="underline hover:text-white">
            Resend
          </a>
        </p>
      </div>
    </section>
  );
}
