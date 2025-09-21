import { useEffect, useState } from "react";
import type { User } from "@app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPen, faTrash, faXmark, faPlus, faEye } from "@fortawesome/free-solid-svg-icons";

type Mode = "create" | "edit" | "view";

type Props = {
  mode: Mode;
  data?: User;
  onSubmit?: (u: User) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
};

function emptyUser(): User {
  return {
    id: crypto.randomUUID(),
    name: "",
    email: "",
    roles: [],
    emailVerified: false,
    createdAt: new Date().toISOString()
  } as User;
}

export default function UserFormCard({ mode, data, onSubmit, onDelete, onCancel }: Props) {
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const [form, setForm] = useState<User>(data ?? emptyUser());

  useEffect(() => {
    if (isCreate) setForm(emptyUser());
    else if (data) setForm(data);
  }, [mode, data]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isView) return;
    onSubmit?.({ ...form, updatedAt: new Date().toISOString() } as User);
  }

  return (
    <div className="border border-white/10 bg-black/60 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm">
          {isCreate && (<><FontAwesomeIcon icon={faPlus} /><span>New User</span></>)}
          {isEdit && (<><FontAwesomeIcon icon={faPen} /><span>Edit User</span></>)}
          {isView && (<><FontAwesomeIcon icon={faEye} /><span>View User</span></>)}
        </div>

        <div className="flex gap-2">
          {!isCreate && form?.id && (
            <button
              onClick={() => onDelete?.(form.id!)}
              className="border border-white/20 hover:border-red-400/70 hover:text-red-300 px-3 py-2 text-xs uppercase tracking-widest"
              type="button"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Delete
            </button>
          )}

          <button
            onClick={onCancel}
            className="border border-white/20 hover:border-white/50 px-3 py-2 text-xs uppercase tracking-widest"
            type="button"
          >
            <FontAwesomeIcon icon={faXmark} className="mr-2" />
            Close
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-xs text-white/60">Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            disabled={isView}
            className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
            placeholder="Full name"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs text-white/60">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            disabled={isView}
            className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
            placeholder="email@example.com"
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-white/60">Role</span>
            <select
              value={form.roles?.[0] || "user"}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as any }))}
              disabled={isView}
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </label>
        </div>

        {!isView && (
          <div className="pt-2">
            <button
              type="submit"
              className="border border-white/20 hover:border-white/50 px-5 py-2 text-xs uppercase tracking-widest"
            >
              <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
              {isCreate ? "Create" : "Save"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
