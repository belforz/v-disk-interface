require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS handling: allow cross-origin requests for uploads.
// Configure via environment variable `CORS_ORIGIN`. Default is '*' (public).
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Simple CORS middleware (controls allowed origin, methods and headers)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  // Allow requests to send credentials when needed (disabled by default)
  if (process.env.CORS_ALLOW_CREDENTIALS === 'true') {
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Parse JSON requests
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get folder from request or use default 'images'
    const folder = req.body.folder || 'images';
    
    // Create full path to directory inside the server folder (server/public/<folder>)
    const uploadDir = path.join(__dirname, 'public', folder);

    // Debug: log destination information
    console.debug('[upload] destination folder:', folder);
    console.debug('[upload] uploadDir:', uploadDir);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize file name
    const sanitizedName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-_]/g, '');
    
    // Check if file exists and add timestamp if it does
  const uploadDir = path.join(__dirname, 'public', req.body.folder || 'images');
    const filePath = path.join(uploadDir, sanitizedName);
    
    console.debug('[upload] filename callback - original:', file.originalname);
    console.debug('[upload] filename callback - sanitized:', sanitizedName);
    console.debug('[upload] filename callback - filePath candidate:', filePath);

    if (fs.existsSync(filePath)) {
      const timestamp = Date.now();
      const extension = path.extname(sanitizedName);
      const fileName = path.basename(sanitizedName, extension);
      cb(null, `${fileName}-${timestamp}${extension}`);
    } else {
      cb(null, sanitizedName);
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: function (req, file, cb) {
    // Accept only image files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  // Debug: show incoming body and file metadata
  console.debug('[upload] POST /api/upload body:', req.body);
  console.debug('[upload] POST /api/upload file:', req.file);

  if (!req.file) {
    console.warn('[upload] No file in request');
    return res.status(400).json({ 
      success: false, 
      message: 'No file uploaded' 
    });
  }
  
  // Construct the path to the uploaded file (relative to public)
  const folder = req.body.folder || 'images';
  const filePath = `/${folder}/${req.file.filename}`;

  // Build an absolute URL that the client can use directly
  const host = req.get('host');
  const protocol = req.protocol;
  const url = `${protocol}://${host}${filePath}`;

  console.debug('[upload] saved file path:', filePath);
  console.debug('[upload] accessible url:', url);

  res.json({
    success: true,
    path: filePath,
    url,
    filename: req.file.filename,
    size: req.file.size
  });
});

// Provide a friendly GET response on /api/upload to explain usage
app.get('/api/upload', (req, res) => {
  res.json({
    success: true,
    message: 'This endpoint accepts POST with form-data (field "file"). Use POST /api/upload to upload files. Images are served from /images/<filename>.'
  });
});

// Explicitly serve image files via GET (falls back to express.static)
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;

  console.debug('[static] GET /images request for:', filename);
  const filePath = path.join(__dirname, 'public', 'images', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }

  return res.sendFile(filePath);
});

// Serve static files from the server's public directory (server/public)
app.use(express.static(path.join(__dirname, 'public')));

// Forward API requests to main API server if needed
// This is a placeholder for potential future expansion
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not implemented' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/api/upload`);
});