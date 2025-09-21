export function buildSrc(path?: string | null, options?: { w?: number, h?: number, crop?: string }) {
  if (!path) return '/images/placeholder.png';
  // If Cloudinary url, allow transformations via inserting `/upload/` params when possible
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      // crude detection for cloudinary domain
      if (path.includes('res.cloudinary.com')) {
        // if options provided, inject transformation after /upload/
        if (options && (options.w || options.h || options.crop)) {
          const url = new URL(path);
          const parts = url.pathname.split('/');
          const uploadIndex = parts.findIndex(p => p === 'upload');
          if (uploadIndex !== -1) {
            const transform: string[] = [];
            if (options.w) transform.push(`w_${options.w}`);
            if (options.h) transform.push(`h_${options.h}`);
            if (options.crop) transform.push(`c_${options.crop}`);
            parts.splice(uploadIndex + 1, 0, transform.join(','));
            url.pathname = parts.join('/');
            return url.toString();
          }
        }
      }
      return path;
    }

    if (path.startsWith('blob:')) return path;
    if (path.startsWith('/')) {
      const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD || '';
      if (UPLOAD_BASE) return `${UPLOAD_BASE.replace(/\/$/, '')}${path}`;
      return path;
    }
  } catch (e) {
    // fallback
  }
  return '/images/placeholder.png';
}
