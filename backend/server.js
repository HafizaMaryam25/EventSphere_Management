import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes Imports
import adminRoutes from './routes/adminRoutes.js';
import authrouter from './routes/authRoutes.js';
import boothrouter from './routes/boothRoute.js';
import exhibitorRoute from './routes/exhibitorRoutes.js';
import attendeeRoutes from './routes/attendeeRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import notificationRoutes from './routes/notificationRoute.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';

dotenv.config();

// --------------------------------------------------
// DNS
// --------------------------------------------------

dns.setServers(['8.8.8.8', '1.1.1.1']);

// --------------------------------------------------
// Express App
// --------------------------------------------------

const app = express();

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'https://eventsphere-frontend-dun.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin
    // (Postman, server-to-server, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Exact allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Allow Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

app.use('/uploads', express.static('uploads'));

// --------------------------------------------------
// Environment Variables Check
// --------------------------------------------------

const requiredEnv = [
  'JWT_SECRET',
  'MONGO_URL',
];

const missingEnv = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missingEnv.length > 0) {
  console.warn(
    `⚠️ Missing environment variables: ${missingEnv.join(', ')}`
  );
}

// --------------------------------------------------
// MongoDB
// --------------------------------------------------

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return true;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');

    const db = await mongoose.connect(
      process.env.MONGO_URL,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    isConnected =
      db.connections[0].readyState === 1;

    if (isConnected) {
      console.log(
        '✅ Database Connected Successfully'
      );

      return true;
    }

    return false;

  } catch (error) {
    isConnected = false;

    console.error(
      '❌ MongoDB Connection Failed:',
      error.message
    );

    return false;
  }
};

// --------------------------------------------------
// Database Middleware
// --------------------------------------------------

app.use(async (req, res, next) => {
  const connected = await connectDB();

  if (!connected) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
    });
  }

  next();
});

// --------------------------------------------------
// Test Route
// --------------------------------------------------

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EventSphere Backend is Live!',
  });
});

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use('/auth', authrouter);

app.use('/admin', adminRoutes);

app.use('/api/booths', boothrouter);

app.use('/api/exhibitor', exhibitorRoute);

app.use('/api/messages', messageRoutes);

app.use('/attendee', attendeeRoutes);

app.use('/api/feedback', feedbackRoutes);

app.use('/api/rating', ratingRoutes);

app.use('/api/notifications', notificationRoutes);

app.use('/api/bookmarks', bookmarkRoutes);

// --------------------------------------------------
// HTTP SERVER
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// --------------------------------------------------
// Socket.IO
// --------------------------------------------------

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }

      callback(
        new Error(`Socket CORS blocked: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
    ],
  },

  transports: [
    'websocket',
    'polling',
  ],
});

// Make Socket.IO available inside routes
app.set('io', io);

// --------------------------------------------------
// Socket.IO Connection
// --------------------------------------------------

io.on('connection', (socket) => {
  console.log(
    `🔌 Socket connected: ${socket.id}`
  );

  // User joins their own room
  socket.on('join', (userId) => {
    if (!userId) {
      return;
    }

    const room = String(userId);

    socket.join(room);

    console.log(
      `👤 User ${room} joined notification room`
    );
  });

  // Disconnect
  socket.on('disconnect', (reason) => {
    console.log(
      `🔌 Socket disconnected: ${socket.id} | ${reason}`
    );
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

httpServer.listen(PORT, () => {
  console.log(
    `🚀 EventSphere Backend running on port ${PORT}`
  );

  console.log(
    `🔌 Socket.IO is ready`
  );
});

// --------------------------------------------------
// Export
// --------------------------------------------------

export { io };

export default app;
