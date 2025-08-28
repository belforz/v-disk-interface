import { useEffect, useState } from "react";
import { fetchJSON } from "@app/lib/api";
import type { Product } from "@app/types";
import { ProductCard } from "@app/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJSON<Product[]>("/api/products")
      .then(setProducts)
      .catch(err => setError(String(err)));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4">
      <section className="py-10 md:py-14">
        <h1 className="sr-only">Beyoncé x Levi’s — coleção</h1>

        {error && (
          <div className="mb-6 text-red-400 text-sm">
            Falha ao carregar produtos: {error}
          </div>
        )}

        <div className="grid gap-10 md:grid-cols-3">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
