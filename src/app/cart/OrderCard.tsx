import { useState } from "react";
import { useAuth, useOrder } from "@app/hooks";
import type { Order, OrderItem } from "@app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

type Props = {
  order: Order;
  onView?: (orderId: string) => void;
};

function formatDate(d?: string | Date) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date
  );
}

function formatMoney(value = 0, currency = "BRL") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
}

function StatusPill({ status }: { status?: string | null | undefined }) {
  const base =
    "inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-widest border";
  const map: Record<string, string> = {
    pending: "border-yellow-300/40 text-yellow-300",
    processing: "border-blue-300/40 text-blue-300",
    shipped: "border-sky-300/40 text-sky-300",
    delivered: "border-lime-300/40 text-lime-300",
    cancelled: "border-red-300/40 text-red-300",
  };
  const key = (status ?? "pending").toLowerCase();
  return (
    <span className={`${base} ${map[key] ?? "border-white/30 text-white/70"}`}>
      {status ?? "pending"}
    </span>
  );
}

export default function OrderCardSimple({ order, onView }: Props) {
  const items: OrderItem[] = order.items ?? [];
  const thumbs = items.slice(0, 3);
  const rest = Math.max(0, items.length - thumbs.length);
  const { getOrderById, loading: ordersLoading } = useOrder();
  const [actionLoading, setActionLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [detailedOrder, setDetailedOrder] = useState<Order | null>(null);
  const { user} = useAuth();

  const isAdmin = user?.roles.includes("ADMIN")

  async function handleView() {
    try {
      setActionLoading(true);
      if (expanded) {
        // collapse
        setExpanded(false);
        setDetailedOrder(null);
        // still notify parent that view was toggled
        if (onView) onView(order.id);
        return;
      }

      const data = await getOrderById(order.id);
      setDetailedOrder(data ?? null);
      setExpanded(true);
      if (onView) onView(order.id);
    } finally {
      setActionLoading(false);
    }
  }

  // Compute total from items (price stored as string in OrderItem)
  const total = items.reduce((acc, it) => {
    const price = it.price ? parseFloat(it.price as unknown as string) : 0;
    const qty = it.quantity ?? 1;
    const line = Number.isFinite(price) ? price * qty : 0;
    return acc + line;
  }, 0);

  const totalItems = items.reduce((acc, it) => acc + (it.quantity ?? 1), 0);


  return (
    <div className="border border-white/10 bg-black/60 p-4 md:p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <StatusPill status={order.orderStatus} />
          <div className="text-sm text-white/80">#{order.id}</div>
        </div>
  <div className="text-xs text-white/60">{formatDate(order.createdAt ?? undefined)}</div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {thumbs.map((it, idx) => (
          <div
            key={idx}
            className="w-14 h-14 rounded bg-neutral-900 border border-white/10 overflow-hidden"
            title={it.title ?? "item"}
          >
            {it.coverPath ? (
              <img src={it.coverPath} alt={it.title ?? "item"} className="w-full h-full object-cover" />
            ) : null}
          </div>
        ))}
        {rest > 0 && (
          <div className="w-14 h-14 rounded border border-white/10 grid place-items-center text-xs text-white/70">+{rest}</div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/80">
          {totalItems} item(s) · <strong className="text-white">{formatMoney(total, "BRL")}</strong>
        </div>

        {!expanded &&  !isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={handleView}
            disabled={actionLoading || ordersLoading}
            className="border border-white/20 hover:border-white/50 px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {actionLoading ? "Loading..." : expanded ? "Hide" : "See more"}
            <FontAwesomeIcon icon={faPen} className="ml-2" />
          </button>
        </div>
        )}
      </div>
      {expanded && detailedOrder ? (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-white/80">Order details</div>
            <div className="text-xs text-white/60">Status: {detailedOrder.orderStatus ?? '—'}</div>
          </div>

          <div className="grid gap-3">
            {(detailedOrder.items ?? []).map((it, i) => {
              const unit = it.price ? parseFloat(it.price as unknown as string) : 0;
              const qty = it.quantity ?? 1;
              const subtotal = Number.isFinite(unit) ? unit * qty : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded bg-neutral-900 border border-white/10 overflow-hidden">
                    {it.coverPath ? <img src={it.coverPath} alt={it.title ?? 'item'} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{it.title ?? it.vinylId}</div>
                    <div className="text-xs text-white/60">{it.artist ?? ''}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-xs text-white/60">{qty} × {formatMoney(unit, 'BRL')}</div>
                    <div className="font-medium">{formatMoney(subtotal, 'BRL')}</div>
                  </div>
                </div>
              );
            })}

            <div className="mt-2 border-t border-white/5 pt-3 flex items-center justify-between">
              <div className="text-sm text-white/80">Total</div>
              <div className="text-sm font-semibold">{formatMoney((detailedOrder.items ?? []).reduce((acc, it) => {
                const unit = it.price ? parseFloat(it.price as unknown as string) : 0;
                const qty = it.quantity ?? 1;
                return acc + (Number.isFinite(unit) ? unit * qty : 0);
              }, 0), 'BRL')}</div>
            </div>

            <div className="mt-2 text-xs text-white/60">
              <div>Payment id: {detailedOrder.paymentId ?? '—'}</div>
              <div>Confirmed: {detailedOrder.isPaymentConfirmed ? 'Yes' : 'No'}</div>
              <div>Created: {formatDate(detailedOrder.createdAt ?? undefined)}</div>
              <div>Updated: {formatDate(detailedOrder.updatedAt ?? undefined)}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
