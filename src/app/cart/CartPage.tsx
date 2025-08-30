import { useCart } from "@app/store/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToolTip } from "@app/components/toolTip";

export default function CartPage() {
  const { items, inc, dec, remove, total, clear } = useCart();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl uppercase tracking-wider mb-8">Bag</h1>

      {items.length === 0 ? (
        <p className="text-white/70">Your bag is currently empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-white/10 pb-6">
                <div className="w-48 h-48 bg-neutral-900 flex-shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{item.name}</div>
                  <div className="text-white/60 text-xs mt-1">$ {item.price} USD</div>

                  <div className="mt-3 flex items-center gap-3">
                    <ToolTip content="Decrease quantity">
                    <button className="p-2 border border-white/20" onClick={() => dec(item.id)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    </ToolTip>
                    <span className="text-sm">{item.qty}</span>
                    <ToolTip content="Increase quantity">
                    <button className="p-2 border border-white/20" onClick={() => inc(item.id)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    </ToolTip>

                    <ToolTip content = "Erase item">
                    <button
                      className="ml-4 text-white/60 hover:text-white"
                      onClick={() => remove(item.id)}
                      
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    </ToolTip>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="border border-white/10 p-5 h-fit">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>R$ {total().toFixed(2)} BRL</span>
            </div>
            <button className="mt-5 w-full border border-white/20 hover:border-white/50 py-3 uppercase tracking-widest text-xs">
              Checkout
            </button>
            <button onClick={clear} className="mt-3 w-full text-white/60 text-xs underline">
              Clear Bag
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
