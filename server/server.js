require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

require('./socket/index')(io);

// Routes
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
    server.listen(PORT, () => {
        logger.info(`Ascend & Lifeline server running on port ${PORT}`);
    });
}

module.exports = { app, server };
