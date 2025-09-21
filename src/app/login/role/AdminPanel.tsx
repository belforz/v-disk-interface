import { useEffect, useState } from "react";
import VinylFormCard from "@app/vinyl/VinylFormCard";
import { Vinyl, User, Order, CreateOrderRequest, UpdateOrderRequest } from "@app/types";
import { VinylCard } from "@app/components/VinylCard";
// StaggerList was temporarily added but reverted per user request
import { useVinyl, useUser, useOrder } from "@app/hooks";
import UserCard from "@app/components/UserCardForm";
import UserFormCard from "@app/components/UsersFormCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { notify } from "@app/lib/toast";
import OrderCardSimple from "@app/cart/OrderCard";

function formatMoney(value = 0, currency = "BRL") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

type Panel =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "view"; data: Vinyl | User }
  | { kind: "edit"; data: Vinyl | User };

type OrderPanel =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "view"; data: Order }
  | { kind: "edit"; data: Order };

type Tab = "products" | "users" | "orders";

export default function AdminPanel() {
  const { vinyls, loading: loadingVinyls, getAllVinyl, createVinyl, updateVinyl, deleteVinyl } = useVinyl();
  const { users, loading: loadingUsers, getAllUsers, createUser, updateUser, deleteUser } = useUser();
  const {orders, loading: loadingOrders, getAllOrders, getByCustomer, getOrderById, deleteOrder, updateOrder, createOrder} = useOrder();
  const [panel, setPanel] = useState<Panel>({ kind: "none" });
  const [orderPanel, setOrderPanel] = useState<OrderPanel>({ kind: "none" });
  const [tab, setTab] = useState<Tab>("products");

  useEffect(() => {
    getAllVinyl(100, 0).catch(() => {});
    getAllUsers().catch(() => {});
    getAllOrders().catch(() => {});
  }, []);

  async function handleCreateSubmit(payload: Vinyl | User) {
    if ((payload as User).email !== undefined) {
      await createUser(payload as User).catch(() => {});
      notify.success("User created successfully!")
    } else {
      await createVinyl(payload as Vinyl).catch(() => {});
      notify.success("Vinyl created sucessfully!")
    }
    setPanel({ kind: "none" });
  }

  async function handleEditSubmit(payload: Vinyl | User) {
    if (!payload.id) return;
    if ((payload as User).email !== undefined) {
      await updateUser(payload.id, payload as User).catch(() => {});
      notify.success("User edited sucessfully !")
    } else {
      await updateVinyl(payload.id, payload as Vinyl).catch(() => {});
      notify.success("Vinyl edited successfully!");
    }
    setPanel({ kind: "none" });
  }
  
  // Separate handlers for orders
  async function handleOrderSubmit(payload: CreateOrderRequest | UpdateOrderRequest) {
    if (orderPanel.kind === "create") {
      // For creation, we need a valid CreateOrderRequest with userId
      if ((payload as CreateOrderRequest).userId) {
        await createOrder(payload as CreateOrderRequest).catch(() => {});
        notify.success("Order created successfully!");
      }
    } else if (orderPanel.kind === "edit") {
      // For edits, we need the order ID
      const orderId = orderPanel.data.id;
      if (orderId) {
        await updateOrder(orderId, payload as UpdateOrderRequest).catch(() => {});
        notify.success("Order edited successfully!");
      }
    }
    setOrderPanel({ kind: "none" });
  }

  async function handleDelete(id: string) {
    if (tab === "users") {
      await deleteUser(id).catch(() => {});
      notify.success("User deleted successfully!");
    } else if (tab === "orders") {
      await deleteOrder(id).catch(() => {});
      notify.success("Order deleted successfully!");
    } else {
      await deleteVinyl(id).catch(() => {});
      notify.success("Vinyl deleted successfully!");
    }
    setPanel({ kind: "none" });
  }

  // Inline OrderForm: edit/view only order config fields; items are readonly
  function OrderForm({
    mode,
    data,
    onSubmit,
    onDelete,
    onCancel,
  }: {
    mode: "view" | "edit" | "create";
    data?: Order;
    onSubmit: (payload: CreateOrderRequest | UpdateOrderRequest) => Promise<void> | void;
    onDelete?: (id: string) => void;
    onCancel: () => void;
  }) {
    const [userId, setUserId] = useState(data?.userId ?? "");
    const [orderStatus, setOrderStatus] = useState<string | undefined>(data?.orderStatus ?? undefined);
    const [paymentId, setPaymentId] = useState<string | undefined>(data?.paymentId ?? undefined);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean | undefined>(data?.isPaymentConfirmed ?? undefined);
    const [qt, setQt] = useState<number | undefined>(data?.qt ?? undefined);

    const readonly = mode === "view";

    async function submit() {
      if (mode === "create") {
        const payload: CreateOrderRequest = {
          userId,
          items: [],
        };
        await onSubmit(payload);
        return;
      }

      // edit
      const updatePayload: UpdateOrderRequest = {};
      if (userId) updatePayload.userId = userId;
      if (orderStatus !== undefined) updatePayload.orderStatus = orderStatus;
      if (paymentId !== undefined) updatePayload.paymentId = paymentId;
      if (isPaymentConfirmed !== undefined) updatePayload.isPaymentConfirmed = isPaymentConfirmed;
      if (qt !== undefined) updatePayload.qt = qt;
      await onSubmit(updatePayload);
    }

    return (
      <div className="border border-white/10 bg-black/60 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/60">User ID</label>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} disabled={readonly} className="w-full mt-1 p-2 bg-neutral-900 border border-white/10" />
          </div>

          <div>
            <label className="text-xs text-white/60">Order Status</label>
            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} disabled={readonly} className="w-full mt-1 p-2 bg-neutral-900 border border-white/10">
              <option value="">—</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELED">CANCELED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60">Payment ID</label>
            <input value={paymentId ?? ""} onChange={(e) => setPaymentId(e.target.value)} disabled={readonly} className="w-full mt-1 p-2 bg-neutral-900 border border-white/10" />
          </div>

          <div>
            <label className="text-xs text-white/60">Payment Confirmed</label>
            <div>
              <input type="checkbox" checked={!!isPaymentConfirmed} onChange={(e) => setIsPaymentConfirmed(e.target.checked)} disabled={readonly} />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60">Total Quantity (qt)</label>
            <input type="number" value={qt ?? ""} onChange={(e) => setQt(e.target.value ? Number(e.target.value) : undefined)} disabled={readonly} className="w-full mt-1 p-2 bg-neutral-900 border border-white/10" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-white/60">Items (readonly)</label>
            <div className="mt-2 space-y-2">
              {(data?.items ?? []).map((it, i) => (
                <div key={i} className="flex items-center gap-3 border border-white/5 p-2">
                  <div className="flex-1">
                    <div className="text-sm">{it.title ?? it.vinylId}</div>
                    <div className="text-xs text-white/60">qty: {it.quantity ?? 1}</div>
                  </div>
                  <div className="text-sm">{it.price ? formatMoney(parseFloat(it.price as unknown as string), 'BRL') : '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {!readonly && (
            <button className="border border-white/20 px-4 py-2" onClick={submit}>Save</button>
          )}
          {onDelete && data?.id && (
            <button className="border border-white/20 px-4 py-2" onClick={() => onDelete(data.id!)}>Delete</button>
          )}
          <button className="border border-white/20 px-4 py-2" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  console.log("Vinyls para renderizar:", vinyls);

  return (
    <div className="w-full">
      {/* Regular panel for products and users */}
      {panel.kind !== "none" && (
        <div className="mt-8">
          {panel.kind === "create" && (tab === "users" ? (
            <UserFormCard mode="create" onSubmit={handleCreateSubmit} onCancel={() => setPanel({ kind: "none" })} />
          ) : (
            <VinylFormCard mode="create" onSubmit={handleCreateSubmit} onCancel={() => setPanel({ kind: "none" })} />
          ))}

          {panel.kind === "edit" && (tab === "users" ? (
            <UserFormCard
              mode="edit"
              data={panel.data as User}
              onSubmit={handleEditSubmit}
              onDelete={(id) => handleDelete(id)}
              onCancel={() => setPanel({ kind: "none" })}
            />
          ) : (
            <VinylFormCard
              mode="edit"
              data={panel.data as Vinyl}
              onSubmit={handleEditSubmit}
              onDelete={(id) => handleDelete(id)}
              onCancel={() => setPanel({ kind: "none" })}
            />
          ))}

          {panel.kind === "view" && (tab === "users" ? (
            <UserFormCard
              mode="view"
              data={panel.data as User}
              onDelete={(id) => handleDelete(id)}
              onCancel={() => setPanel({ kind: "none" })}
            />
          ) : (
            <VinylFormCard
              mode="view"
              data={panel.data as Vinyl}
              onDelete={(id) => handleDelete(id)}
              onCancel={() => setPanel({ kind: "none" })}
            />
          ))}
        </div>
      )}

      {/* Separate panel for orders */}
      {orderPanel.kind !== "none" && (
        <div className="mt-8">
          {orderPanel.kind === "create" && (
            <OrderForm 
              mode="create" 
              onSubmit={handleOrderSubmit} 
              onCancel={() => setOrderPanel({ kind: "none" })} 
            />
          )}

          {orderPanel.kind === "edit" && (
            <OrderForm
              mode="edit"
              data={orderPanel.data}
              onSubmit={handleOrderSubmit}
              onDelete={(id) => handleDelete(id)}
              onCancel={() => setOrderPanel({ kind: "none" })}
            />
          )}

          {orderPanel.kind === "view" && (
            <OrderForm
              mode="view"
              data={orderPanel.data}
              onSubmit={handleOrderSubmit} // Not used in view mode
              onDelete={(id) => handleDelete(id)}
              onCancel={() => setOrderPanel({ kind: "none" })}
            />
          )}
        </div>
      )}

      <section className="mt-8">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTab("products");
                setPanel({ kind: "none" });
                setOrderPanel({ kind: "none" });
              }}
              className={`px-4 py-2 text-xs uppercase tracking-widest ${tab === "products" ? 'border border-white/20' : 'text-white/60'}`}>
              Products
            </button>
            <button
              onClick={() => {
                setTab("users");
                setPanel({ kind: "none" });
                setOrderPanel({ kind: "none" });
              }}
              className={`px-4 py-2 text-xs uppercase tracking-widest ${tab === "users" ? 'border border-white/20' : 'text-white/60'}`}>
              Users
            </button>
            <button
              onClick={() => {
                setTab("orders");
                setPanel({ kind: "none" });
                setOrderPanel({ kind: "none" });
              }}
              className={`px-4 py-2 text-xs uppercase tracking-widest ${tab === "orders" ? 'border border-white/20' : 'text-white/60'}`}>
              Orders
            </button>
          </div>

          <div>
            {tab !== 'orders' ? (
              <button
                className="border border-white/20 hover:border-white/50 px-6 py-2 uppercase tracking-widest text-xs"
                onClick={() => setPanel({ kind: "create" })}
              >
                New {tab === 'users' ? 'User' : 'Product'}
              </button>
            ) : (
              <button
                className="border border-white/20 hover:border-white/50 px-6 py-2 uppercase tracking-widest text-xs"
                onClick={() => setOrderPanel({ kind: "create" })}
              >
                New Order
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tab === 'products' ? (
            loadingVinyls ? (
              <div className="col-span-full text-center text-white/60">Loading...</div>
            ) : vinyls && vinyls.length > 0 ? (
              vinyls.map((vinyl) => (
                <div key={vinyl.id} className="relative group">
                  <VinylCard vinyl={vinyl} />

                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPanel({ kind: "view", data: vinyl })}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1 text-xs uppercase"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setPanel({ kind: "edit", data: vinyl })}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(vinyl.id!)}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-white/60">No products found.</div>
            )
          ) : tab === 'users' ? (
            // Users tab
            loadingUsers ? (
              <div className="col-span-full text-center text-white/60">Loading...</div>
            ) : users && users.length > 0 ? (
              users.map((u) => (
                <div key={u.id} className="relative group">
                  <UserCard user={u} />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPanel({ kind: "view", data: u })}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1 text-xs uppercase"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setPanel({ kind: "edit", data: u })}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id!)}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-white/60">No users found.</div>
            )
          ) : (
            // Orders tab
            loadingOrders ? (
              <div className="col-span-full text-center text-white/60">Loading...</div>
            ) : orders && orders.length > 0 ? (
              orders.map((o) => (
                <div key={o.id} className="relative group">
                  <OrderCardSimple order={o} />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setOrderPanel({ kind: "view", data: o })}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1 text-xs uppercase"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setOrderPanel({ kind: "edit", data: o })}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(o.id!)}
                      className="border border-white/20 bg-black/70 hover:border-white/50 px-2 py-1"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-white/60">No orders found.</div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
