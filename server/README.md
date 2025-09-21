# V-Disk Upload Server

This is a simple Express.js server for handling file uploads for the V-Disk interface.

## Installation

```bash
npm install
```

## Usage

```bash
node server.js
```

The server will start on port 8080 by default, or use the PORT environment variable.

## API

### POST /api/upload

Uploads a file to the server and saves it in the public/images directory.

Parameters:
- `file`: The file to upload
- `folder` (optional): The folder to save the file in (default: "images")

Returns:
```json
{
  "success": true,
  "path": "/images/filename.jpg"
}
```