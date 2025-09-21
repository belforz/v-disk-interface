import { useEffect, useMemo, useState, useRef } from "react";
import type { Vinyl } from "@app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPen,
  faTrash,
  faXmark,
  faPlus,
  faEye,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { uploadFile } from "@app/lib/fileUpload";
import { notify } from "@app/lib/toast";

type Mode = "create" | "edit" | "view";

type Props = {
  mode: Mode;
  data?: Vinyl;
  onSubmit?: (vinyl: Vinyl) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
};

function emptyVinyl(): Vinyl {
  return {
    id: crypto.randomUUID(),
    title: "",
    artist: "",
    price: 0,
    stock: 0,
    coverPath: "",
    gallery: [],
    isPrincipal: false,
    createdAt: new Date().toISOString() as any,
    updatedAt: new Date().toISOString() as any,
  };
}

export default function VinylFormCard({
  mode,
  data,
  onSubmit,
  onDelete,
  onCancel,
}: Props) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const [formData, setFormData] = useState<Vinyl>(data ?? emptyVinyl());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  
  useEffect(() => {
    if (isCreateMode) setFormData(emptyVinyl());
    else if (data) setFormData(data);
  }, [mode, data, isCreateMode]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const preview = previewUrl ?? formData.coverPath;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isViewMode) return;

    // Normalize image paths before submitting to backend
    const normalize = (p: string) => {
      if (!p) return p;
      // blob/object URLs are previews only — should have been replaced already
      if (p.startsWith("blob:")) {
        // This shouldn't happen as we should have uploaded the file by now
        notify.error("Image upload wasn't completed. Please try uploading the image again.");
        return ""; // Return empty to prevent broken images
      }
      // If operator accidentally used /public/images, convert to /images
      if (p.startsWith("/public/images/")) return p.replace("/public/images/", "/images/");
      return p;
    };

    const normalized: Vinyl = {
      ...formData,
      coverPath: normalize(formData.coverPath),
      gallery: (formData.gallery || []).map((g) => normalize(g)),
      createdAt: formData.createdAt ?? (new Date().toISOString() as any),
      updatedAt: new Date().toISOString() as any,
    };

    onSubmit?.(normalized);
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (isCreateMode || !formData.id) return;

    onDelete?.(formData.id);
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onCancel?.();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // First create a local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    try {
      setUploading(true);
      
      // Show loading state
      notify.info("Uploading image...");
      
      // Upload file to server
      const path = await uploadFile(file);
      
      // Update form with new path
      setFormData((p) => ({ ...p, coverPath: path }));
      
      notify.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      
      // Fallback - use local path but warn user
      const sanitized = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
      const appPath = `/images/${sanitized}`;
      setFormData((p) => ({ ...p, coverPath: appPath }));
      
      notify.error("Failed to upload image to server. The image reference has been saved but you'll need to manually upload the file to the server's public/images directory.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // First create a local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    try {
      setUploading(true);
      
      
      // Upload file to server
      const path = await uploadFile(file);
      
      // Update form with new path
      setFormData((p) => ({ ...p, coverPath: path }));
      
      notify.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      
      // Fallback - use local path but warn user
      const sanitized = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
      const appPath = `/images/${sanitized}`;
      setFormData((p) => ({ ...p, coverPath: appPath }));
      
      notify.error("Failed to upload image to server. The image reference has been saved but you'll need to manually upload the file to the server's public/images directory.");
    } finally {
      setUploading(false);
    }
  }

  // Revoke preview blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // The image file is uploaded to the server via API, which stores it in the public/images folder
  // We use FormData to send the file to the server and receive back the path where it was saved

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className="border border-white/10 bg-black/60 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm">
          {isCreateMode && (
            <>
              <FontAwesomeIcon icon={faPlus} />
              <span>New Vinyl</span>
            </>
          )}
          {isEditMode && (
            <>
              <FontAwesomeIcon icon={faPen} />
              <span>Edit Vinyl</span>
            </>
          )}
          {isViewMode && (
            <>
              <FontAwesomeIcon icon={faEye} />
              <span>View Vinyl</span>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {!isCreateMode && formData.id && (
            <button
              onClick={() => onDelete?.(formData.id!)}
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

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div
          className="bg-neutral-900 border border-white/10 mb-4 p-2 cursor-pointer relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt={formData.title || "vinyl"}
                className="w-full aspect-[3/4] object-cover object-center"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-white/80 flex flex-col items-center">
                    <FontAwesomeIcon icon={faUpload} spin size="2x" className="mb-2" />
                    <span>Uploading...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full aspect-[3/4] grid place-items-center text-xs text-white/50">
              {uploading ? (
                <div className="text-white/80 flex flex-col items-center">
                  <FontAwesomeIcon icon={faUpload} spin size="2x" className="mb-2" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={faUpload} className="mb-2" size="2x" />
                  <span>Drag an image or select a file.</span>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture
            className="hidden"
            onChange={handleFileChange}
            disabled={isViewMode || uploading}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col ">
          <label className="block">
            <span className="text-xs text-white/60">Name</span>
            <input
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              disabled={isViewMode}
              placeholder="Vinyl Title"
            />
          </label>

          <label className="block">
            <span className="text-xs text-white/60">Artist</span>
            <input
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              value={formData.artist}
              onChange={(e) =>
                setFormData((p) => ({ ...p, artist: e.target.value }))
              }
              disabled={isViewMode}
              placeholder="Artist"
              min={0}
            />
          </label>

          <label className="block">
            <span className="text-xs text-white/60">Price (USD)</span>
            <input
              type="number"
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              value={formData.price}
              onChange={(e) =>
                setFormData((p) => ({ ...p, price: Number(e.target.value) }))
              }
              disabled={isViewMode}
              min={0}
            />
          </label>

          <label className="block">
            <span className="text-xs text-white/60">Stock</span>
            <input
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData((p) => ({ ...p, stock: Number(e.target.value) }))
              }
              disabled={isViewMode}
              placeholder="Vinyl Quantity"
              min={0}
            />
          </label>

          <label className="block">
            <span className="text-xs text-white/60">Home Show</span>
            <input
            className="mt-1 w-full bg-black accent-white border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
            type="checkbox" 
            checked={formData.isPrincipal ?? false}
            onChange={(e) =>
              setFormData((p) => ({ ...p, isPrincipal: e.target.checked }))
            }
            disabled={isViewMode}
          />

          </label>

          <label className="block">
            <span className="text-xs text-white/60">Image URL</span>
            <input
              className="mt-1 w-full bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/50"
              value={formData.coverPath}
              onChange={(e) =>
                setFormData((p) => ({ ...p, coverPath: e.target.value }))
              }
              disabled={isViewMode}
              placeholder="/images/vinyl-01.png"
            />
          </label>

          {!isViewMode && (
            <div className="text-xs text-white/50">
              <div className="pt-2 flex gap-3 justify-center items-center">
                <button
                  type="submit"
                  className="border border-white/20 hover:border-white/50 px-5 py-2 text-xs uppercase tracking-widest flex items-center"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
                  {isCreateMode ? "Create" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-white/20 hover:border-white/50 px-5 py-2 text-xs uppercase tracking-widest flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
