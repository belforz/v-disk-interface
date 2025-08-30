import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="grid place-items-center px-4 py-10">
      <img
        src="/images/v-disk-not-found.png"
        className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
        loading="lazy"
        alt="v-disk-not-found"
      />
      <div className="text-center">
        <p className="mt-5 text-sm text-white/50">
          The page you are looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="border border-white/20 hover:border-white/50 px-6 py-2 text-xs uppercase tracking-widest"
          >
            Go back home
          </Link>
        </div>
      </div>
    </section>
  );
}
