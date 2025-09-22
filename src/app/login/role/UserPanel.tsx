import { useEffect } from "react";
import OrderCardSimple from "@app/cart/OrderCard";
import { useAuth, useOrder } from "@app/hooks";

export default function UserPanel() {
  const { orders, loading, getAllOrders } = useOrder();
  const { user } = useAuth();

  useEffect(() => {
    getAllOrders().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userOrders = (orders ?? []).filter((o) => o.userId === user?.id);

  return (
    <div className="w-full bg-black">
      <div className="p-6 rounded-md overflow-hidden max-w-6xl mx-auto mb-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl mx-auto mb-6">
              <img
                src="/images/v-disk-user.png"
                className="w-full max-w-[300px] md:max-w-[400px] aspect-square object-cover mx-auto"
                loading="lazy"
                alt="v-disk user"
              />
              
              </div>
              <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider text-center">
                {`Hi, ${user?.name ?? "User"}!`}
          </h1>
              </div>
              <p className="mt-3 mb-4 text-white/70 text-center">
            See your orders below
          </p>
              </div>
      <section className="p-8 border border-white/10 bg-black/60 rounded-md max-w-6xl mx-auto">
        <h2 className="text-xl font-display uppercase tracking-wider mb-6">Your Orders</h2>
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center text-white/60 p-8">Loading orders...</div>
          ) : userOrders.length > 0 ? (
            userOrders.map((o) => (
              <OrderCardSimple key={o.id} order={o} />
            ))
          ) : (
            <div className="text-center text-white/60 p-8 border border-white/5 rounded">
              No orders found. When you make a purchase, your orders will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
