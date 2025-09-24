import { useEffect, useRef, useState } from "react";
import { Vinyl } from "@app/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./carrousel.css";

type Props = {
  items: Vinyl[];
  autoPlay?: boolean;
  intervalMs?: number;
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

export default function FeaturedHero({ 
  items = [], 
  autoPlay = true, 
  intervalMs = 5000 
}: Props) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const hoverRef = useRef(false);

  const total = items.length;
  
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

  // Autoplay timer
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

  // Navigation functions
  function go(delta: number) {
    setPrevIndex(index);
    setIndex((i) => (i + delta + total) % total);
  }
  
  // If no items, show a fallback
  if (total === 0) {
    return (
      <div className="border border-white/10 bg-black/60 relative">
        <div className="md:flex h-[400px] md:h-[500px]">
          <div className="w-full p-6 md:p-10 flex flex-col justify-center items-center">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-center">
              Premium Vinyl Records
            </h1>
            <p className="mt-4 text-white/70 text-center">
              Discover a world of sound
            </p>
            <div className="mt-6">
              <Link 
                to="/disks" 
                className="bg-white text-black px-6 py-3 text-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 ease-out">
                Browse All Records
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider">
          Premium Vinyl Records
        </h1>
        <p className="mt-3 text-white/70">
          Discover a world of sound
        </p>
        
        <div className="mt-5">
          <Link
            to="/disks"
            className="bg-white text-black px-6 py-3 text-sm uppercase tracking-widest inline-block hover:scale-105 hover:shadow-lg transition-all duration-200 ease-in-out"
          >
            Browse All Records
          </Link>
        </div>
      </div>
      
      <section
        className="relative overflow-hidden border border-white/10 bg-black/60"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        {/* Hero carousel slides */}
        <div className="relative h-[400px] md:h-[500px]">
          {items.map((item, i) => {
            const active = i === index;
            const exiting = i === prevIndex && prevIndex !== null;
            const className = [
              "carousel-slide",
              active ? "entering" : "",
              exiting ? "exiting" : "",
            ].join(" ").trim();

            return (
              <div
                key={item.id}
                aria-hidden={!active}
                className={className}
                onAnimationEnd={() => {
                  if (exiting) setPrevIndex(null);
                }}
              >
                {/* Hero image */}
                {item.coverPath ? (
                  <img
                    src={item.coverPath}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="w-full h-full bg-black/80 grid place-items-center">
                    <p className="text-white/50">No image available</p>
                  </div>
                )}

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 py-8 md:py-10">
                  {item.isPrincipal && (
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 mb-3 text-[10px] uppercase tracking-widest">
                      Featured
                    </div>
                  )}
                  
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider">
                    {item.title}
                  </h2>
                  
                  <div className="mt-2 text-white/80">
                    {item.artist || "Unknown Artist"}
                    {typeof item.price === "number" && (
                      <span className="ml-3 inline-block">
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-5">
                    <Link
                      to={`/product/${item.id}`}
                      className="inline-block border border-white/30 hover:border-white bg-black/40 backdrop-blur-sm px-5 py-2 text-[11px] uppercase tracking-widest"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation controls */}
        {total > 1 && (
          <>
            {/* Arrow buttons */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={() => go(-1)}
                className="pointer-events-auto w-10 h-10 grid place-items-center border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => go(1)}
                className="pointer-events-auto w-10 h-10 grid place-items-center border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrevIndex(index);
                    setIndex(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}