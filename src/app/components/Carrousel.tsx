
import type { Vinyl } from "@app/types";
import { useEffect, useRef, useState } from "react";
import "./carrousel.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export type SlideItem = Vinyl & {
  badge?: string;     
  ctaLabel?: string;  
  ctaHref?: string;   
};

type Props = {
  items: SlideItem[];
  intervalMs?: number;   
  autoPlay?: boolean;
  title?: string;
  description?: string;
};

// Custom hook for preloading images
function useImagePreloader(imageUrls: string[]) {
  useEffect(() => {
    imageUrls.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);
}

export default function FeaturedSlideshow({
  items,
  intervalMs = 4000,
  autoPlay = true,
  title,
  description
}: Props) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const hoverRef = useRef(false);

  const total = items.length;
  const current = items[index];
  
  // Preload all images for smoother transitions
  const imagesToPreload = items
    .map(item => item.coverPath)
    .filter(Boolean) as string[];
  
  useImagePreloader(imagesToPreload);
  
  // Preload the next image when index changes
  useEffect(() => {
    const nextIndex = (index + 1) % total;
    const nextImage = items[nextIndex]?.coverPath;
    
    if (nextImage) {
      const img = new Image();
      img.src = nextImage;
    }
  }, [index, items, total]);

  // autoplay - restart interval whenever index/autoPlay/interval changes so we have current index
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    if (timer.current) window.clearInterval(timer.current);
    
    timer.current = window.setInterval(() => {
      if (!hoverRef.current) {
        setPrevIndex(index);
        setIndex((i) => (i + 1) % total);
      }
    }, intervalMs);
    
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [autoPlay, intervalMs, total, index]);

  function go(delta: number) {
    setPrevIndex(index);
    setIndex((i) => (i + delta + total) % total);
  }

  return (
    <div className="mx-auto w-full">
      {/* Optional title and description */}
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider mb-2">{title}</h2>}
          {description && <p className="text-white/70">{description}</p>}
        </div>
      )}
      
      <section
        className="relative overflow-hidden border border-white/10 bg-black/60 mx-auto"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        {/* Slides empilhados com fade */}
        <div className="relative h-[360px] sm:h-[420px] md:h-[520px]">
          {items.map((it, i) => {
            const active = i === index;
            const exiting = i === prevIndex && prevIndex !== null;
            const className = [
              "carousel-slide",
              active ? "entering" : "",
              exiting ? "exiting" : "",
            ].join(" ").trim();

            return (
              <div
                key={it.id}
                aria-hidden={!active}
                className={className}
                onAnimationEnd={() => {
                  // clear prevIndex once exiting animation finished
                  if (exiting) setPrevIndex(null);
                }}
              >
                {/* imagem */}
                {it.coverPath ? (
                  <img
                    src={it.coverPath}
                    alt={it.title}
                    className="w-full h-full object-cover object-center"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-xs text-white/50">
                    No image
                  </div>
                )}

                {/* overlay de gradiente para leitura */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* legenda */}
                <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 py-5">
                  {it.badge && (
                    <span className="inline-block text-[10px] uppercase tracking-widest border border-white/20 bg-black/60 px-2 py-0.5 mb-2">
                      {it.badge}
                    </span>
                  )}
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-wider">
                    {it.title}
                  </h3>
                  <div className="text-white/70 text-sm">
                    {it.artist ?? "Unknown artist"}
                    {typeof it.price === "number" && (
                      <span className="ml-2 text-white/70">
                        •{" "}
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "USD"
                        }).format(it.price)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {/* <Link
                      to={it.ctaHref ?? `/p/${it.slug}`}
                      className="border border-white/20 hover:border-white/50 px-4 py-2 text-[11px] uppercase tracking-widest"
                    >
                      {it.ctaLabel ?? "See details"}
                    </Link> */}
                    <Link
                      to="/disks"
                      className="border border-white/10 hover:border-white/40 px-4 py-2 text-[11px] uppercase tracking-widest"
                    >
                      Browse all
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controles */}
        {total > 1 && (
          <>
            {/* setas */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:px-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="pointer-events-auto size-9 grid place-items-center border border-white/15 hover:border-white/40 bg-black/40 backdrop-blur"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(+1)}
                className="pointer-events-auto size-9 grid place-items-center border border-white/15 hover:border-white/40 bg-black/40 backdrop-blur"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* bolinhas / progresso */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                    key={i}
                    onClick={() => { setPrevIndex(index); setIndex(i); }}
                    aria-label={`Go to slide ${i + 1}`}
                    className={[
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-6 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
                    ].join(" ")}
                  />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
