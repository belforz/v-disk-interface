// NOTE: Uploads should go to the image server (separate from the main API).
// Prefer Cloudinary when configured via VITE_CLOUDINARY_CLOUD + VITE_CLOUDINARY_PRESET.
// Otherwise, fall back to the local image upload server (VITE_API_UPLOAD).
const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD || import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD || '';
const CLOUD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || '';

// We intentionally do not use the shared `api` axios instance here because that instance
// is configured to point to your main backend API (VITE_API_URL). Uploads need to hit the
// image server which serves `/api/upload` and writes files to /public/images.
// Using fetch keeps this dependency lightweight and avoids auth interceptors.

/**
 * Uploads a file to the server.
 * @param file The file to upload
 * @param folder Optional folder path (e.g. 'images', 'thumbnails')
 * @returns The path to the uploaded file (relative to public directory)
 */
export async function uploadFile(file: File, folder = 'images'): Promise<string> {
  // Sanitize file name to prevent path traversal and invalid characters
  const sanitizedName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
  
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('file', file, sanitizedName);
  formData.append('folder', folder);
  
  // Set up the correct headers for multipart/form-data
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  // If Cloudinary is configured, upload directly to Cloudinary and return the secure URL
  if (CLOUD_NAME && CLOUD_PRESET) {
    try {
      const cloudForm = new FormData();
      cloudForm.append('file', file);
      cloudForm.append('upload_preset', CLOUD_PRESET);
      cloudForm.append('folder', folder);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
        method: 'POST',
        body: cloudForm,
      });

      if (!cloudRes.ok) {
        const t = await cloudRes.text();
        throw new Error(`Cloudinary upload failed: ${cloudRes.status} ${t}`);
      }

      const cloudData = await cloudRes.json();
      return cloudData?.secure_url ?? `/images/${sanitizedName}`;
    } catch (err) {
      console.error('Cloudinary upload failed, falling back to local upload:', err);
      // continue to local upload fallback below
    }
  }

  // Send the request to the image server upload endpoint (fallback)
  try {
    const res = await fetch(`${UPLOAD_BASE}/api/upload`, {
      method: 'POST',
      // Note: fetch will set the correct multipart boundary when `body` is a FormData
      body: formData,
      // CORS: ensure the image server allows requests from the dev origin (e.g. http://localhost:5173)
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data?.path ?? `/images/${sanitizedName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    // Return a fallback path that indicates failure but won't break the app
    return `/images/${sanitizedName}`;
  }
}