import { useEffect, useState } from "react";
import { fetchJSON } from "@app/lib/api";
import type { Vinyl } from "@app/types";
import { VinylCard } from "@app/components/VinylCard";

export default function HomePage() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchJSON<Vinyl[]>("/api/products")
      .then(data => {setVinyls(data);
        console.log("vinyls", data)
      })
      .catch(err => setError(String(err)));
  }, []);
  

  return (
    <section className="mx-auto max-w-7xl px-4">
      <section className="py-10 md:py-14">
        <h1 className="sr-only">Beyoncé x Levi’s — coleção</h1>

        {error && (
          <div className="mb-6 text-red-400 text-sm">
            Falha ao carregar produtos: {error}
          </div>
        )}
        
        <div className="grid gap-10 md:grid-cols-3">
          {vinyls.map(vinyl => (
            <VinylCard key={vinyl.id} vinyl={vinyl} />
          ))}
        
        </div>
      </section>
    </section>
  );
}
