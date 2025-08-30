export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 py-10 text-center text-xs text-white/60">
      <p>
        © {new Date().getFullYear()} V Disk Store (demo). Developed by{" "}
        <a
          href="https://portfoliobelforz.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          belforz
        </a>{" "}
        with React + Vite + Tailwind.
      </p>
    </footer>
  );
}
