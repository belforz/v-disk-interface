import { useEffect, useState } from "react";
import VinylFormCard from "@app/vinyl/VinylFormCard";
import { Vinyl } from "@app/types";
import { VinylCard } from "@app/components/VinylCard";
import { useVinyl } from "@app/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

type Panel =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "view"; data: Vinyl }
  | { kind: "edit"; data: Vinyl };

export default function AdminPanel() {
  const { vinyls, loading, getAllVinyl, createVinyl, updateVinyl, deleteVinyl } = useVinyl();
  const [panel, setPanel] = useState<Panel>({ kind: "none" });

  useEffect(() => {

    getAllVinyl(100, 0).catch(() => {});
    
  }, []);

  async function handleCreateSubmit(payload: Vinyl) {
    await createVinyl(payload).catch(() => {});
    setPanel({ kind: "none" });
  }

  async function handleEditSubmit(payload: Vinyl) {
    if (!payload.id) return;
    await updateVinyl(payload.id, payload).catch(() => {});
    setPanel({ kind: "none" });
  }

  async function handleDelete(id: string) {
    await deleteVinyl(id).catch(() => {});
    setPanel({ kind: "none" });
  }

  console.log("Vinyls para renderizar:", vinyls);

  return (
    <div className="w-full">
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
          {loading ? (
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
          )}
        </div>
      </section>
    </div>
  );
}
