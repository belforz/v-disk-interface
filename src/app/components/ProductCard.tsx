import { Link } from "react-router-dom";
import type { Product } from "@app/types";
import { useCart } from "@app/store/cart";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const add = useCart(s => s.add);

  return (
    <div className="group">
      <Link to={`/p/${product.slug}`} className="block bg-neutral-900">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full aspect-[3/4] object-cover object-center"
          loading="lazy"
        />
      </Link>

      <div className="mt-4 space-y-1">
        <Link to={`/p/${product.slug}`} className="block text-sm tracking-wide">
          {product.name}
        </Link>
        <div className="text-white/60 text-xs">$ {product.price} USD</div>

        <button
          onClick={() => add(product, 1)}
          className="mt-2 w-full border border-white/20 hover:border-white/50 text-xs uppercase tracking-widest py-2"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
}
