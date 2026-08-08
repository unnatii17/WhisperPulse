const express = require("express");
const app = express();

require("events").EventEmitter.defaultMaxListeners = 0;

const dotenv = require("dotenv");
dotenv.config();

// =========================
// Routes
// =========================

const userRoutes = require("./routes/User");
const postRoutes = require("./routes/Post");
const likeRoutes = require("./routes/Like");
const commentRoutes = require("./routes/Comment");
const replyRoutes = require("./routes/Reply");
const feedbackRoutes = require("./routes/Feedback");
const notificationRoutes = require("./routes/Notification");

// =========================
// Configs
// =========================

const database = require("./configs/database");
const { cloudinaryConnect } = require("./configs/cloudinary");

// =========================
// Middleware
// =========================

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// =========================
// Database
// =========================

database.connect();

// =========================
// Cloudinary
// =========================

cloudinaryConnect();

// =========================
// Basic Middleware
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================
// CORS
// =========================

const allowedOrigins = [
  "https://whisper-pulse-mnle43gio-unnati7200-1765s-projects.vercel.app",
  "http://localhost:1001",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Postman / server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    // Allowed frontend
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow localhost development ports
    if (/^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

// =========================
// File Upload
// =========================

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// =========================
// Routes
// =========================

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/reply", replyRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/notification", notificationRoutes);

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Your server is up and running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WhisperPulse server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS: Origin not allowed",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// =========================
// Start Server
// =========================

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is running at ${PORT}`);
});

// =========================
// Graceful Shutdown
// =========================

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
