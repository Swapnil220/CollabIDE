import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { initializeSocket } from './services/socketService.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// --- CORS Setup ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.CLIENT_RENDER_URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Handle preflight OPTIONS requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes ---
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// --- Error Handling Middleware ---
app.use(errorHandler);

// --- Socket.io Setup ---
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// --- Initialize WebSockets ---
initializeSocket(io);

// --- Export server for Render ---
export { httpServer, io };
