import { useState } from "react";
import { useParams } from "react-router-dom";
import OrderCardSimple, { OrderMini } from "@app/components/OrderCard";
import { VinylCard } from "@app/components/VinylCard";
import VinylFormCard from "@app/components/VinylFormCard";
import { Vinyl } from "@app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

type Panel =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "view"; data: Vinyl }
  | { kind: "edit"; data: Vinyl };

const mockOrder: OrderMini = {
  id: "ord_1",
  number: "B-2025-0001",
  status: "cancelled",
  createdAt: new Date().toISOString(),
  currency: "USD",
  total: 380,
  items: [
    { name: "Trucker Western Crystal", image: "/images/jacket-western-crystal.png", qty: 1 },
    { name: "501 Curve Western Crystal", image: "/images/jeans-curve.png", qty: 1 },
    { name: "Laced Up", image: "/images/jacket-laced.png", qty: 1 },
  ],
};

export default function RolePage() {
  const { role } = useParams();

  const [panel, setPanel] = useState<Panel>({ kind: "none" });

  const [vinyls, setVinyls] = useState<Vinyl[]>([
    {
      id: "prod_1",
      title: "Produto 1",
      price: 100,
      coverPath: "/images/produto-1.png",
      artist: "Artist 1",
      stock: 10,
      gallery: ["/images/produto-1.png"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_2",
      title: "Produto 2",
      price: 200,
      coverPath: "/images/produto-2.png",
      artist: "Artist 2",
      stock: 8,
      gallery: ["/images/produto-2.png"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_3",
      title: "Produto 3",
      price: 300,
      coverPath: "/images/produto-3.png",
      artist: "Artist 3",
      stock: 5,
      gallery: ["/images/produto-3.png"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  function handleCreateSubmit(v: Vinyl) {
    setVinyls((prev) => [v, ...prev]);
    setPanel({ kind: "none" });
  }

  function handleEditSubmit(v: Vinyl) {
    setVinyls((prev) => prev.map((p) => (p.id === v.id ? v : p)));
    setPanel({ kind: "none" });
  }

  function handleDelete(id: string) {
    setVinyls((prev) => prev.filter((p) => p.id !== id));
    setPanel({ kind: "none" });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col items-center">
        {role === "admin" ? (
          <img
            src="/images/v-disk-login.png"
            className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
            loading="lazy"
            alt="v-disk login"
          />
        ) : (
          <img
            src="/images/v-disk-user.png"
            className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] aspect-square object-cover"
            loading="lazy"
            alt="v-disk user"
          />
        )}

        <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wider text-center mt-6">
          {role === "admin" ? "Painel do Admin" : `Hi, ${role || "USER"}!`}
        </h1>
        <p className="mt-3 text-white/70 text-center">
          {role === "admin" ? "Manage products below" : "See your orders below"}
        </p>
      </div>

      {role === "admin" && (
        <>
          
          {panel.kind !== "none" && (
            <div className="mt-8">
              {panel.kind === "create" && (
                <VinylFormCard mode="create" onSubmit={handleCreateSubmit} onCancel={() => setPanel({ kind: "none" })} />
              )}

              {panel.kind === "edit" && (
                <VinylFormCard
                  mode="edit"
                  data={panel.data}
                  onSubmit={handleEditSubmit}
                  onDelete={(id) => handleDelete(id)}
                  onCancel={() => setPanel({ kind: "none" })}
                />
              )}

              {panel.kind === "view" && (
                <VinylFormCard
                  mode="view"
                  data={panel.data}
                  onDelete={(id) => handleDelete(id)}
                  onCancel={() => setPanel({ kind: "none" })}
                />
              )}
            </div>
          )}

          <section className="mt-8">
            <div className="flex justify-end mb-4">
              <button
                className="border border-white/20 hover:border-white/50 px-6 py-2 uppercase tracking-widest text-xs"
                onClick={() => setPanel({ kind: "create" })}
              >
                New Product
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vinyls.length > 0 ? (
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
              )}
            </div>
          </section>
        </>
      )}

      {role !== "admin" && (
        <>
          <h2 className="font-display text-2xl uppercase tracking-wider mb-6">My Orders</h2>
          <OrderCardSimple order={mockOrder} onView={(id) => console.log("ver", id)} />
        </>
      )}
    </main>
  );
}
