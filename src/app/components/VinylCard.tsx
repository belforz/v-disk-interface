import type { Vinyl } from "@app/types";
import { useParams } from "react-router-dom";
import { useCartFacade } from "@app/hooks/useCartFacade";
import { notify } from "@app/lib/toast";
import { useState } from "react";

type Props = { vinyl: Vinyl };

export function VinylCard({ vinyl }: Props) {
  const { role } = useParams();
  const { add } = useCartFacade();
  const [adding, setAdding] = useState(false);

  

  const rawCover = Array.isArray(vinyl.coverPath) ? vinyl.coverPath[0] : vinyl.coverPath;

  // Build a safe image src:
  // - blob: URLs and absolute http(s) URLs are used as-is
  // - paths that start with '/' are treated as relative to the image server (VITE_API_UPLOAD)
  // - otherwise fall back to placeholder
  const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD || '';

  function buildSrc(path?: string | null) {
    if (!path) return '/images/placeholder.png';
    if (path.startsWith('blob:')) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) {
      // If an upload base is configured, prefix it (ensure no double slashes)
      if (UPLOAD_BASE) return `${UPLOAD_BASE.replace(/\/$/, '')}${path}`;
      return path; // assume same origin serves /images
    }
    return '/images/placeholder.png';
  }

  return (
    <div className="group ">
      <img
        src={buildSrc(rawCover ?? '')}
        alt={vinyl.title}
        className="w-full aspect-[3/4] object-cover object-center"
        loading="lazy"
      />

      <div className="mt-4 space-y-1">
        <h3 className="text-white font-semibold text-sm truncate">
          {vinyl.title}
        </h3>

        <div className="text-white/60 text-xs">$ {vinyl.price} USD</div>

        <div className="text-white/60 text-xs truncate">
          Artist: {vinyl.artist}
        </div>
        
        {role == "admin" && (
          <>
            <div className="text-white/60 text-xs truncate">
              Stock: {vinyl.stock}
            </div>
            <div className="text-white/60 text-xs truncate">
              CoverPath: {vinyl.coverPath}
            </div>
            <div className="text-white/60 text-xs truncate">
              Gallery: {vinyl.gallery.join(", ")}
            </div>
            <div className="text-white/60 text-xs truncate">ID: {vinyl.id}</div>
          </>
        )}

        {role !== "admin" && (
          <div className="mt-2 ">
            <button
              onClick={async () => {
                try {
                  setAdding(true);
                  await add(vinyl.id, 1);
                } catch (e: any) {
                  notify.error(e?.message ?? "Failed to add to cart");
                } finally {
                  setAdding(false);
                }
              }}
              disabled={adding}
              className="mt-2 w-full border border-white/20 hover:border-white/50 text-xs uppercase tracking-widest py-2 disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add to Bag"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
