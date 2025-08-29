import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJSON } from "@app/lib/api";
import type { Vinyl } from "@app/types";
import { useCart } from "@app/store/cart";

export default function VinylPage() {
  const { slug } = useParams();
  const [vinyl, setVinyl] = useState<Vinyl | null>(null);
  const [error, setError] = useState<string | null>(null);
  const add = useCart(s => s.add);

  useEffect(() => {
    if (!slug) return;
    fetchJSON<Vinyl>(`/api/Vinyls/${slug}`)
      .then(setVinyl)
      .catch(err => setError(String(err)));
  }, [slug]);

  if (error) {
    return <div className="mx-auto max-w-4xl px-4 py-10">Erro: {error}</div>;
  }

  if (!vinyl) {
    return <div className="mx-auto max-w-4xl px-4 py-10">Carregando…</div>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="bg-neutral-900">
          <img
            src={vinyl.coverPath}
            alt={vinyl.title}
            className="w-full aspect-square object-cover"
          />
        </div>

        <div>
          <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider">
            {vinyl.title}
          </h1>
          <p className="mt-3 text-white/70">R$ {vinyl.price} BRL</p>

          <button
            onClick={() => add(vinyl, 1)}
            className="mt-6 border border-white/20 hover:border-white/50 px-6 py-3 uppercase tracking-widest text-xs"
          >
            Add to Bag
          </button>

          {vinyl.title && (
            <p className="mt-6 text-sm text-white/70">{vinyl.title}</p>
          )}
        </div>
      </div>
    </main>
  );
}
