import { useCartFacade } from "@app/hooks/useCartFacade";
import { buildSrc } from "@app/lib/image";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faTrash,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { ToolTip } from "@app/components/toolTip";
import { useOrder } from "@app/hooks/useOrder";
import { useAuth } from "@app/hooks/useAuth";
import { notify } from "@app/lib/toast";

export default function CartPage() {
  const { items, add, remove, update, clear, loading } = useCartFacade();
  type CartUI = {
    id: string;
    vinylId: string;
    qty: number;
    name: string;
    price: number;
    coverPath: string;
  };
  const safeItems = (items || []) as CartUI[];
  function subtotal() {
    return safeItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  }

  console.log("cartui", safeItems);


  const { createOrder, loading: creating } = useOrder();
  const { user } = useAuth();

  async function handleCheckout() {
    if (!safeItems.length) {
      notify.info("Your bag is empty");
      return;
    }
    if (!user || !user.id) {
      notify.info("Please log in to proceed to checkout");
      return;
    }

    try {
      // create an order first; payment flow will be handled server-side/externally
      const orderPayload = {
        userId: user.id,
        items: safeItems.map((i) => ({
          vinylId: i.vinylId,
          quantity: i.qty ?? 1,
          coverPath: i.coverPath,
        })),
        qt: safeItems.reduce((acc, i) => acc + (i.qty ?? 1), 0),
      };
      await createOrder(orderPayload);
      await clear();
      notify.success("Order created. Proceed to payment when you're ready.");
    } catch (e: any) {
      notify.error("Failed to create order");
      // eslint-disable-next-line no-console
      console.error("Order creation error", e);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-display text-2xl uppercase tracking-wider">Bag</h1>
        {/* <div className="relative">
          <FontAwesomeIcon icon={faShoppingBag} className="text-white/60" />
          <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-none text-white bg-red-600 rounded-full">
            {safeItems.length}
          </span>
        </div> */}
      </div>

      {safeItems.length === 0 ? (
        <p className="text-white/70">Your bag is currently empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            {safeItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-white/10 pb-6"
              >
                <div className="w-48 h-48 bg-neutral-900 flex-shrink-0 grid place-items-center text-xs text-white/60">
                  <img
                    src={buildSrc(item.coverPath)}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm">{item.name ?? "Item"}</div>
                  <div className="text-white/60 text-xs mt-1">
                    $ {(item.price ?? 0).toFixed(2)} USD
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <ToolTip content="Decrease quantity">
                      <button
                        className="p-2 border border-white/20"
                        onClick={() => {
                          const newQty = Math.max(1, (item.qty ?? 1) - 1);
                          void update(item.id, newQty);
                        }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </ToolTip>
                    <span className="text-sm">{item.qty}</span>
                    <ToolTip content="Increase quantity">
                      <button
                        className="p-2 border border-white/20"
                        onClick={() => {
                          const newQty = (item.qty ?? 1) + 1;
                          void update(item.id, newQty);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </ToolTip>

                    <ToolTip content="Erase item">
                      <button
                        className="ml-4 text-white/60 hover:text-white"
                        onClick={() => {
                          void remove(item.id);
                        }}
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
              <span>R$ {subtotal().toFixed(2)} BRL</span>
            </div>
            <button
              onClick={() => {
                void handleCheckout();
              }}
              disabled={creating}
              className="mt-5 w-full border border-white/20 hover:border-white/50 py-3 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {creating ? "Processing..." : "Checkout"}
            </button>
            <button
              onClick={() => {
                void clear();
              }}
              className="mt-5 w-full border border-white/20 hover:border-white/50 py-3 uppercase tracking-widest text-xs"
            >
              Clear Bag
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
