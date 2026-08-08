const {
  auth,
  isAdmin,
} = require("../middlewares/auth");

const {
  createPost,
  editPost,
  deletePost,
  getPosts,
  getUserPosts,
  reportPost,
  getUserPostsStats,
  postExist,
} = require("../controllers/Post");

const { Router } = require("express");

const router = Router();

// Create Post
router
  .route("/create-post")
  .post(auth, createPost);

// Edit Post
router
  .route("/edit-post")
  .post(auth, editPost);

// Delete Post
router
  .route("/delete-post")
  .post(auth, deletePost);

// Get All Posts
router
  .route("/get-post")
  .get(auth, getPosts);

// Get User Posts
router
  .route("/get-user-posts")
  .get(auth, getUserPosts);

// Report Post
router
  .route("/report-post")
  .post(auth, reportPost);

// Get User Post Statistics
router
  .route("/get-user-stats")
  .get(auth, getUserPostsStats);

// Check Post Exists
router
  .route("/post-exists")
  .get(auth, postExist);

// Check Post Exists - POST
router
  .route("/post-exist")
  .post(auth, postExist);

module.exports = router;
