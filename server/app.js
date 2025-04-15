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

dotenv.config();

const app = express();

// ✅ Allowed client origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.CLIENT_RENDER_URL
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for this origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ API routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// ✅ Error handler
app.use(errorHandler);

// ✅ Socket.io setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// ✅ Initialize socket handling
initializeSocket(io);

// ✅ Export server and socket
export { httpServer, io };
