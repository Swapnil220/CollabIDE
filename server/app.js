import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { initializeSocket } from './services/socketService.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Allowed origins (update with your actual frontend domain)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.CLIENT_RENDER_URL
];

// CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Apply CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight request handler

// Log incoming request origin (debug only)
app.use((req, res, next) => {
  console.log('Incoming request origin:', req.headers.origin);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Error middleware
app.use(errorHandler);

// HTTP & Socket.io Server Setup
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize WebSocket
initializeSocket(io);

export { httpServer, io };
