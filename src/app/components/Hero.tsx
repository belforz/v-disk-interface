import { ArrowRight, Music2, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
     
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <div className="size-[80vmin] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_60%)] blur-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto mb-8 grid place-items-center">
          <div className="relative">
            <img
              src="/images/v-disk-login.png"
              alt="V-Disk"
              className="w-[220px] sm:w-[280px] md:w-[340px] lg:w-[420px] aspect-square object-contain opacity-95"
            />
            <div className="absolute inset-0 animate-pulse pointer-events-none rounded-full ring-1 ring-white/5" />
          </div>
        </div>

        <h1 className="text-center font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider">
          Welcome to V-Disk
        </h1>
        <p className="mt-3 text-center text-white/70 max-w-2xl mx-auto">
          Explore our curated vinyl collection — limited drops, classics and exclusive pressings.
        </p>

        {/* ações principais */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/disks"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 px-5 py-2 text-xs uppercase tracking-widest"
          >
            Browse Disks <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 px-5 py-2 text-xs uppercase tracking-widest"
          >
            Explore Artists
          </Link>
        </div>

        {/* micro-provas / stats */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-white/70">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <Music2 className="h-4 w-4" />
            <span>1,200+ Disks</span>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <Users className="h-4 w-4" />
            <span>300+ Artists</span>
          </div>
          <div className="text-xs uppercase tracking-widest">Ships in 24h</div>
        </div>

        {/* indicador de scroll */}
        <div className="mt-10 flex justify-center" aria-hidden>
          <div className="text-[11px] text-white/60 uppercase tracking-widest flex items-center gap-2">
            Scroll
            <span className="inline-block h-3 w-px bg-white/30" />
            <span className="animate-bounce">▾</span>
          </div>
        </div>
      </div>
    </section>
  );
}
