const express = require("express");
const app = express();
require("events").EventEmitter.defaultMaxListeners = 0;

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
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 4000;

// Database
database.connect();

// Cloudinary
cloudinaryConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://confetti-five.vercel.app",
        "http://localhost:1001",
      ];

      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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
