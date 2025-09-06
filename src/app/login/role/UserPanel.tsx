import { useEffect } from "react";
import OrderCardSimple from "@app/cart/OrderCard";
import { useOrder } from "@app/hooks";

export default function UserPanel() {
  const { orders, loading, getAllOrders } = useOrder();

  useEffect(() => {
    getAllOrders().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <section className="mt-8">
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center text-white/60">Loading orders...</div>
          ) : orders && orders.length > 0 ? (
            orders.map((o) => (
              <OrderCardSimple key={o.id} order={o} />
            ))
          ) : (
            <div className="text-center text-white/60">No orders found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
