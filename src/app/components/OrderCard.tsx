// Componente simples de Card de Pedido
// - Sem integrações
// - Props mínimas (id, número, status, data, total, itens)
// - Responsivo com Tailwind

export type OrderItemMini = {
  name: string;
  image?: string; // opcional
  qty?: number;
};

export type OrderMini = {
  id: string;
  number?: string;                 // ex.: "B-2025-0001"
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: string | Date;       // pode passar string ISO
  total?: number;
  currency?: string;               // "USD" | "BRL" etc.
  items?: OrderItemMini[];
};

type Props = {
  order: OrderMini;
  onView?: (orderId: string) => void; // opcional
};

function formatDate(d?: string | Date) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function formatMoney(value = 0, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

function StatusPill({ status }: { status?: OrderMini["status"] }) {
  const base = "inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-widest border";
  const map: Record<string, string> = {
    pending: "border-yellow-300/40 text-yellow-300",
    processing: "border-blue-300/40 text-blue-300",
    shipped: "border-sky-300/40 text-sky-300",
    delivered: "border-lime-300/40 text-lime-300",
    cancelled: "border-red-300/40 text-red-300",
  };
  return <span className={`${base} ${map[status ?? "pending"] ?? "border-white/30 text-white/70"}`}>{status ?? "pending"}</span>;
}

export default function OrderCardSimple({ order, onView }: Props) {
  const items = order.items ?? [];
  const thumbs = items.slice(0, 3); 
  const rest = Math.max(0, items.length - thumbs.length);

  return (
    <div className="border border-white/10 bg-black/60 p-4 md:p-5">
      
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <StatusPill status={order.status} />
          <div className="text-sm text-white/80">#{order.number ?? order.id}</div>
        </div>
        <div className="text-xs text-white/60">{formatDate(order.createdAt)}</div>
      </div>

      
      <div className="mt-4 flex items-center gap-3">
        {thumbs.map((it, idx) => (
          <div
            key={idx}
            className="w-14 h-14 rounded bg-neutral-900 border border-white/10 overflow-hidden"
            title={it.name}
          >
            {it.image ? (
              <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
            ) : null}
          </div>
        ))}
        {rest > 0 && (
          <div className="w-14 h-14 rounded border border-white/10 grid place-items-center text-xs text-white/70">
            +{rest}
          </div>
        )}
      </div>

      
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/80">
          {items.reduce((acc, i) => acc + (i.qty ?? 1), 0)} item(s) ·{" "}
          <strong className="text-white">
            {formatMoney(order.total ?? 0, order.currency ?? "USD")}
          </strong>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onView?.(order.id)}
            className="border border-white/20 hover:border-white/50 px-4 py-2 text-xs uppercase tracking-widest"
          >
            See more
          </button>
        </div>
      </div>
    </div>
  );
}
