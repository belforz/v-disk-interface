import { useEffect, useState, useCallback, useMemo } from "react";
import type { Vinyl } from "@app/types";
import { VinylCard } from "@app/components/VinylCard";
import { useVinyl } from "@app/hooks";
import SearchBar from "@app/components/SearchBar";
import Hero from "@app/components/Hero";
import Carrousel from "@app/components/Carrousel";

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default function HomePage() {
  const { vinyls, loading, error, getAllVinyl, getHomeVinyl, getVinylByTerm } =
    useVinyl();

  // Carrega os discos de destaque para a página inicial usando getHomeVinyl
  const [homeVinyls, setHomeVinyls] = useState<Vinyl[]>([]);
  const [allVinyls, setAllVinyls] = useState<Vinyl[]>([]);

  // carrega e sincroniza allVinyls com o hook de backend (defensivo)
  useEffect(() => {
    let mounted = true;

    // Se o hook já tem vinyls, use-os imediatamente
    if (Array.isArray(vinyls) && vinyls.length > 0) {
      setAllVinyls(vinyls);
      return () => {
        mounted = false;
      };
    }

    // Caso contrário, tente buscar e logue o resultado para debugar
    const loadAll = async () => {
      try {
        const res = await getAllVinyl?.(100, 1);
        console.debug("getAllVinyl response:", res);
        if (!mounted) return;
        const list: Vinyl[] = Array.isArray(res)
          ? res
          : Array.isArray((res as any)?.data)
          ? (res as any).data
          : Array.isArray(vinyls)
          ? vinyls
          : [];
        setAllVinyls(list);
      } catch (err) {
        console.debug("getAllVinyl failed:", err);
      }
    };

    loadAll();
    return () => {
      mounted = false;
    };
  }, [getAllVinyl, vinyls]);

  useEffect(() => {
    let mounted = true;
    getHomeVinyl()
      .then((res) => {
        if (!mounted) return;
        // aceita formatos: array direto ou envelope { data: [...] }
        const list: Vinyl[] = Array.isArray(res)
          ? res
          : Array.isArray((res as any)?.data)
          ? (res as any).data
          : [];
        setHomeVinyls(list);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [getHomeVinyl]);

  // stable inner search handler
  const handleSearchInner = useCallback(
    async (q: string) => {
      // if (!q || q.trim().length === 0) {
      //   // reload defaults
      //   const res = await getHomeVinyl();
      //   const list: Vinyl[] = Array.isArray(res)
      //     ? res
      //     : Array.isArray((res as any)?.data)
      //     ? (res as any).data
      //     : [];
      //   setHomeVinyls(list);
      //   return;
      // }
      try {
        const results = await getVinylByTerm(q);
        const list: Vinyl[] = Array.isArray(results)
          ? results
          : Array.isArray((results as any)?.data)
          ? (results as any).data
          : [];
        setHomeVinyls(list);
      } catch (e) {
        // ignore — getVinylByTerm sets error in hook
      }
    },
    [getVinylByTerm]
  );

  const handleSearch = useMemo(
    () => debounce(handleSearchInner, 350),
    [handleSearchInner]
  );

  console.log(allVinyls);

  const featuredVinyls = homeVinyls.filter((v) => v.isPrincipal);

  return (
    <section className="mx-auto max-w-7xl px-4">
      <section className="py-8 md:py-12">
        <Hero />

        {/* Featured block: title, description, CTA, carousel */}
        <div className="py-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider text-center">
            Featured
          </h2>
          <p className="text-white/70 mt-3 mb-6 text-center max-w-2xl mx-auto">
            Handpicked highlights from our collection — premium, collectible,
            and sonically exceptional vinyl records chosen by our curators.
          </p>

          <div className="flex justify-center mb-6">
            <a
              href="/disks"
              className="bg-black text-white px-6 py-3 text-sm uppercase tracking-widest inline-block hover:scale-105 hover:shadow-lg hover:bg-white hover:text-black transition-all duration-200 ease-in-out"
            >
              See Highlights
            </a>
          </div>

          <div className="mx-auto max-w-4xl">
            <Carrousel
              items={featuredVinyls.length ? featuredVinyls : homeVinyls}
            />
          </div>
        </div>
        {/* <div className="flex flex-row items-center justify-center gap-10 mb-10">
          <div className="flex-shrink-0">
            <img
              src={`/images/v-disk-home.png`}
              className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover mx-auto"
              loading="lazy"
              alt="v-disk home"
            />
            <div className="text-2xl text-white mt-2 text-center">
            <p>Welcome to V-Disk! Explore our curated vinyl collection.</p>
            </div>
          </div>
        </div> */}
        <div className="flex-1 flex justify-end mb-8">
          <div className="w-full max-w-md mb-10">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Catalog block */}

        <div className="relative col-span-12 md:col-span-8 xl:col-span-6 mt-12">
          <h2 className="font-display text-3xl uppercase tracking-wider mb-4">
            Shop the Collection
          </h2>
          <p className="text-white/70 mb-6 max-w-3xl">
            Explore our full catalog of vinyl records — new arrivals, classics,
            and limited editions. Use the search above to filter by artist,
            title or genre.
          </p>

          {error && (
            <div className="mb-6 text-red-400 text-sm">
              Falha ao carregar produtos: {error.message}
            </div>
          )}

          {!error && loading && allVinyls.length === 0 && (
            <div className="text-sm text-white/60 mb-4">Carregando...</div>
          )}

          {!loading && !error && allVinyls.length === 0 && (
            <div className="text-sm text-white/50">
              Nenhum produto encontrado.
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-3">
            {allVinyls.map((v) => (
              <VinylCard key={v.id} vinyl={v} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
