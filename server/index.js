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
const corsOptions = {
  origin:
    "https://whisper-pulse-mnle43gio-unnati7200-1765s-projects.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));

// Preflight
app.options("*", cors(corsOptions));

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

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
