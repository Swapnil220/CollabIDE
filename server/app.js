// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import userRoutes from './routes/userRoutes.js';
// import projectRoutes from './routes/projectRoutes.js';
// import { initializeSocket } from './services/socketService.js';
// import {errorHandler} from './middleware/errorMiddleware.js';
// import dotenv from 'dotenv';

// const app = express();
// dotenv.config();

// // Middleware
// app.use(cors({
//   origin: [
//     process.env.CLIENT_URL,
//     'http://127.0.0.1:5173'
//   ],
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('MongoDB Connection Error:', err));

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);

// // Error Handling Middleware
// app.use(errorHandler);

// // Socket.io Setup
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: [process.env.CLIENT_URL],
//     methods: ["GET", "POST"]
//   }
// });

// // Initialize Socket.io
// initializeSocket(io);

// export { httpServer, io };



// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import userRoutes from './routes/userRoutes.js';
// import projectRoutes from './routes/projectRoutes.js';
// import { initializeSocket } from './services/socketService.js';
// import { errorHandler } from './middleware/errorMiddleware.js';
// import dotenv from 'dotenv';

// const app = express();
// dotenv.config();

// // Middleware
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'http://127.0.0.1:5173',  // Allow both localhost and 127.0.0.1
//   ],
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('MongoDB Connection Error:', err));

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);

// // Error Handling Middleware
// app.use(errorHandler);

// // Socket.io Setup
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: [
//       'http://localhost:5173',
//       'http://127.0.0.1:5173',  // Allow both localhost and 127.0.0.1
//     ],
//     methods: ["GET", "POST"]
//   }
// });

// // Initialize Socket.io
// initializeSocket(io);

// export { httpServer, io };


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

const app = express();
dotenv.config();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL
  ],
  credentials: true  // Allow credentials (cookies, auth headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Socket.io Setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.CLIENT_URL
    ],
    methods: ["GET", "POST"],
    credentials: true  // Allow credentials for WebSocket connections as well
  }
});

// Initialize Socket.io
initializeSocket(io);

export { httpServer, io };

