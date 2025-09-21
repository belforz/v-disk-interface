export async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD!;
  const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET!;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", PRESET);
  formData.append("folder", "covers");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.secure_url as string; 
}
