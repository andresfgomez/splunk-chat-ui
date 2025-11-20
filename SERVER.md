# Splunk Chat UI - Express Server

This Express server serves the built Angular application and provides a health check endpoint.

## Prerequisites

- Node.js installed
- Angular app built (run `npm run build` first)

## Features

- **Static File Serving**: Serves the built Angular app from `dist/splunk-chat-ui/browser`
- **Gzip Compression**: Automatically compresses responses for better performance
- **Health Check Endpoint**: `/health` endpoint for monitoring
- **SPA Routing Support**: All routes fallback to `index.html` for Angular routing

## Usage

### 1. Build the Angular app
```bash
npm run build
```

### 2. Start the server
```bash
npm run start:server
```

The server will start on port 3000 by default (or use the PORT environment variable).

### 3. Access the application
- **App**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2025-11-20T04:10:00.000Z",
  "uptime": 123.456,
  "service": "splunk-chat-ui"
}
```

## Environment Variables

- `PORT`: Server port (default: 3000)

## Production Deployment

For production, set the PORT environment variable:

```bash
PORT=8080 npm run start:server
```
