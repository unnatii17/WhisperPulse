const express = require("express");
const app = express();

require("events").EventEmitter.defaultMaxListeners = 0;

const dotenv = require("dotenv");
dotenv.config();

// importing routes
const userRoutes = require("./routes/User");
const postRoutes = require("./routes/Post");
const likeRoutes = require("./routes/Like");
const commentRoutes = require("./routes/Comment");
const replyRoutes = require("./routes/Reply");
const feedbackRoutes = require("./routes/Feedback");
const notificationRoutes = require("./routes/Notification");

const database = require("./configs/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./configs/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// Database
database.connect();

// Cloudinary
cloudinaryConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "https://whisper-pulse-mnle43gio-unnati7200-1765s-projects.vercel.app",
  "https://confetti-five.vercel.app",
  "http://localhost:1001",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      // Allow exact frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow localhost development
      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
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
  })
);

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/reply", replyRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/notification", notificationRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
