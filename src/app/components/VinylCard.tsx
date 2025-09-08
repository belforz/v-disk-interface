import type { Vinyl } from "@app/types";
import { useCart } from "@app/store/cart";
import { useParams } from "react-router-dom";

type Props = { vinyl: Vinyl };

export function VinylCard({ vinyl }: Props) {
  const add = useCart((s) => s.add);
  const { role } = useParams();

  const src = Array.isArray(vinyl.coverPath)
    ? vinyl.coverPath[0]
    : vinyl.coverPath || "/images/placeholder.png";

  return (
    <div className="group ">
      <img
        src={src}
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
              onClick={() => add(vinyl, 1)}
              className="mt-2 w-full border border-white/20 hover:border-white/50 text-xs uppercase tracking-widest py-2"
            >
              Add to Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
