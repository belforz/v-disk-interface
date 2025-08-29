

export default function SignUp() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-[7.5rem] ">
      <div className="grid md:grid-cols-1 gap-10 ">
        <div className="flex flex-col items-center">
          <div className="bg-neutral-900">
            <img
              src={`/images/v-disk-login.png`}
              className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
              loading="lazy"
              alt="v-disk login"
            />
          </div>
          <div className="pt-6 pb-4 text-center">
          <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider">
            Welcome!
          </h1>
          <p className="mt-3 text-white/70">Please log in to continue.</p>
            <div className="flex gap-4 md:gap-6">
          <button className="mt-6 border border-white/20 hover:border-white/50 px-6 py-3 uppercase tracking-widest text-xs">
            Login
          </button>
          <button className="mt-6 border border-white/20 hover:border-white/50 px-6 py-3 uppercase tracking-widest text-xs">
            Sign-up
          </button>
          </div>
          </div>
        </div>
      </div>
    </main>
  );
}