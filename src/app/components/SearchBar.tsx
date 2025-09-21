import { useState } from "react";
import { Search } from "lucide-react";

type Props = {
  placeholder?: string;
  onSearch?: (query: string) => void; 
};

export default function SearchBar({ placeholder = "Search vinyls...", onSearch }: Props) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.(query);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg mx-auto mt-8 border border-white/20 bg-black/60"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-white/40"
      />
      <button
        type="submit"
        className="flex items-center gap-2 border-l border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}
