const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'splunk-chat-ui'
    });
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/splunk-chat-ui/browser')));

// Fallback to index.html for all other routes (Angular routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/splunk-chat-ui/browser/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});
