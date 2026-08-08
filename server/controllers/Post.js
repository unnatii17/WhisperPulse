const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const client = require("../configs/client");
const mongoose = require("mongoose");
const Device = require("../models/Device");
const admin = require("firebase-admin");

// ======================================================
// FIREBASE INITIALIZATION
// ======================================================

if (!admin.apps?.length) {
  const serviceAccount = require(
    "../configs/firebase-admin-config"
  );

  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount
    ),
  });
}

const messaging = admin.messaging();
const db = admin.firestore();


// ======================================================
// REDIS HELPERS
// ======================================================

const isRedisReady = () => {
  try {
    return client && client.isReady;
  } catch (error) {
    return false;
  }
};

const safeRedisGet = async (key) => {
  if (!isRedisReady()) return null;

  try {
    return await client.get(key);
  } catch (error) {
    console.error(
      `Redis GET error (${key}):`,
      error.message
    );

    return null;
  }
};

const safeRedisSet = async (key, value) => {
  if (!isRedisReady()) return false;

  try {
    await client.set(key, value);
    return true;
  } catch (error) {
    console.error(
      `Redis SET error (${key}):`,
      error.message
    );

    return false;
  }
};

const safeRedisDelete = async (key) => {
  if (!isRedisReady()) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error(
      `Redis DELETE error (${key}):`,
      error.message
    );

    return false;
  }
};


// ======================================================
// CREATE POST
// ======================================================

exports.createPost = async (req, res) => {
  try {
    const {
      description,
      year,
      color,
    } = req.body;

    const userId =
      req?.body?.userId ||
      req?.user?.id ||
      req?.user?._id;

    const name = req?.body?.name;


    if (!userId || !description) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }


    // ==================================================
    // DAILY POST LIMIT
    // ==================================================

    const userPost = await Post.find({
      author: userId,
    }).sort({
      createdAt: -1,
    });

    const currentTime = Date.now();

    if (
      userPost.length > 20 &&
      currentTime -
        new Date(userPost[19].createdAt).getTime() <
        86400000
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only post 20 times a day",
      });
    }


    // ==================================================
    // CREATE POST
    // ==================================================

    let post = await Post.create({
      author: userId,
      description,
      likes: [],
      comments: [],
      color,
    });


    // ==================================================
    // CONFESSION NOTIFICATION
    // ==================================================

    if (name && year) {
      const confessedTo =
        await User.findOne({
          name,
          year,
        });

      if (confessedTo) {
        const notification =
          await Notification.create({
            sender: userId,
            receiver: confessedTo._id,
            post: post._id,
            message:
              "Seems Like you got a confession!!",
          });

        if (!notification) {
          return res.status(500).json({
            success: false,
            message:
              "Error while creating the notification",
          });
        }
      }
    }


    // ==================================================
    // UPDATE USER
    // ==================================================

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            posts: post._id,
          },
        },
        {
          new: true,
        }
      );


    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message:
          "Couldnt update the user's posts",
      });
    }


    // ==================================================
    // REDIS USER POST COUNT
    // ==================================================

    if (isRedisReady()) {
      try {
        const userPosts =
          Number.parseInt(
            await safeRedisGet(
              `user:${userId}:totalPosts`
            )
          ) || 0;

        await safeRedisSet(
          `user:${userId}:totalPosts`,
          userPosts + 1
        );
      } catch (redisError) {
        console.error(
          "Redis user post count error:",
          redisError.message
        );
      }
    }


    // ==================================================
    // POPULATE POST
    // ==================================================

    post = await Post.findById(
      post._id
    )
      .populate("author")
      .populate({
        path: "likes",
      })
      .exec();


    if (!post) {
      return res.status(500).json({
        success: false,
        message:
          "Post could not be created",
      });
    }


    // ==================================================
    // REDIS POST CACHE
    // ==================================================

    if (isRedisReady()) {
      try {
        await client.set(
          `post:${post._id}`,
          JSON.stringify(post)
        );

        await client.lPush(
          "posts:ids",
          post._id.toString()
        );
      } catch (redisError) {
        console.error(
          "Redis post cache error:",
          redisError.message
        );
      }
    }


    // ==================================================
    // FIREBASE NOTIFICATIONS
    // ==================================================

    try {
      const firstName = name
        ? name.split(" ")[0].toLowerCase()
        : "";

      if (firstName) {
        const probableUserList =
          await User.find({
            name: {
              $regex:
                new RegExp(
                  "^" + firstName,
                  "i"
                ),
            },
          });

        const probableUserIds =
          probableUserList.map(
            (user) => user._id
          );

        let probableTokens =
          await Promise.all(
            probableUserIds.map(
              async (userId) =>
                await Device.findOne({
                  user: userId,
                })
            )
          );

        probableTokens =
          probableTokens.filter(
            (item) => item != null
          );

        probableTokens =
          probableTokens.map(
            (user) =>
              user?.devices || []
          );

        const message = {
          notification: {
            title: "Confession",
            body: `This confession by ${updatedUser?.username} might be for you`,
          },
          data: {
            url: `https://whisper-pulse-mnle43gio-unnati7200-1765s-projects.vercel.app/feed/${post._id}`,
          },
        };

        probableTokens.forEach(
          (userTokens) => {
            const sendPromises =
              userTokens.map(
                (token) => {
                  const parts =
                    token.split("|");

                  const firebaseToken =
                    parts.length >= 3
                      ? parts[2]
                      : token;

                  return messaging.send({
                    ...message,
                    token: firebaseToken,
                  });
                }
              );

            Promise.all(sendPromises)
              .then((response) => {
                console.log(
                  "Successfully sent messages:",
                  response.length
                );
              })
              .catch((error) => {
                console.error(
                  "Error sending messages:",
                  error.message
                );
              });
          });


        // ==================================================
        // FIRESTORE POST
        // ==================================================

        const docRef =
          db.collection("Post").doc(
            post._id.toString()
          );

        await docRef.set({
          author:
            post?.author?.username || "",
          dp:
            post?.author?.displayPicture || "",
          likes: 0,
        });


        // ==================================================
        // FIRESTORE NOTIFICATIONS
        // ==================================================

        await Promise.all(
          probableUserIds.map(
            async (userId) => {
              const notfRef =
                db
                  .collection("Notifications")
                  .doc(userId.toString())
                  .collection("notifications");

              return notfRef.add({
                postId:
                  post?._id.toString(),
                postAuthor:
                  post?.author?.username,
                description:
                  "This confession might be for you",
                type: "post",
                createdAt:
                  admin.firestore.FieldValue.serverTimestamp(),
              });
            }
          )
        );
      }
    } catch (notificationError) {
      console.error(
        "Notification error:",
        notificationError.message
      );

      // Notification failure should not
      // fail post creation.
    }


    // ==================================================
    // GET POSTS FOR RESPONSE
    // ==================================================

    let posts = [];

    if (isRedisReady()) {
      try {
        let postIds =
          await client.lRange(
            "posts:ids",
            0,
            -1
          );

        const cachedPosts =
          await Promise.all(
            postIds.map(
              (id) =>
                client.get(
                  `post:${id}`
                )
            )
          );

        posts = cachedPosts
          .map((item) => {
            try {
              return item
                ? JSON.parse(item)
                : null;
            } catch {
              return null;
            }
          })
          .filter(Boolean);
      } catch (redisError) {
        console.error(
          "Redis response error:",
          redisError.message
        );
      }
    }


    // ==================================================
    // MONGODB FALLBACK
    // ==================================================

    if (!posts.length) {
      posts = await Post.find()
        .populate("author")
        .populate({
          path: "likes",
        })
        .sort({
          createdAt: -1,
        })
        .exec();
    }


    const postLength =
      posts.length;

    posts = posts.slice(0, 4);


    // ==================================================
    // FIRESTORE USER POST DATA
    // ==================================================

    try {
      const userRef =
        db
          .collection("userPosts")
          .doc(
            updatedUser._id.toString()
          );

      await userRef.set({
        author:
          updatedUser.username,
        dp:
          updatedUser.displayPicture,
        posts:
          updatedUser.posts.length,
      });
    } catch (firestoreError) {
      console.error(
        "Firestore user post error:",
        firestoreError.message
      );
    }


    return res.status(200).json({
      success: true,
      message:
        "Post has been created successfully",
      posts,
      postLength,
    });

  } catch (error) {
    console.error(
      "Error while creating the post:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error while creating your post",
    });
  }
};


// ======================================================
// EDIT POST
// ======================================================

exports.editPost = async (
  req,
  res
) => {
  try {
    const {
      postId,
      description,
      caption,
    } = req.body;


    if (!postId) {
      return res.status(400).json({
        success: false,
        message:
          "Post ID is required",
      });
    }


    const post =
      await Post.findById(postId);


    if (!post) {
      return res.status(404).json({
        success: false,
        message:
          "Could not find the post",
      });
    }


    if (description) {
      post.description =
        description;
    }

    if (caption) {
      post.caption = caption;
    }


    const updatedPost =
      await post.save();


    if (!updatedPost) {
      return res.status(500).json({
        success: false,
        message:
          "Error while saving the post",
      });
    }


    const setPost =
      await Post.findById(postId)
        .populate("author")
        .populate({
          path: "likes",
        })
        .exec();


    // Update Redis
    if (isRedisReady()) {
      try {
        await client.set(
          `post:${postId}`,
          JSON.stringify(setPost)
        );


        let postIds =
          await client.lRange(
            "posts:ids",
            0,
            -1
          );


        const posts =
          await Promise.all(
            postIds.map(
              (id) =>
                client.get(
                  `post:${id}`
                )
            )
          );


        const parsedPosts =
          posts
            .map((item) => {
              try {
                return item
                  ? JSON.parse(item)
                  : null;
              } catch {
                return null;
              }
            })
            .filter(Boolean);


        return res.status(200).json({
          success: true,
          message:
            "Post has been updated successfully",
          posts: parsedPosts,
        });

      } catch (redisError) {
        console.error(
          "Redis edit error:",
          redisError.message
        );
      }
    }


    return res.status(200).json({
      success: true,
      message:
        "Post has been updated successfully",
      posts: setPost
        ? [setPost]
        : [],
    });

  } catch (error) {
    console.error(
      "Edit post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error while updating the post",
    });
  }
};


// ======================================================
// DELETE POST
// ======================================================

exports.deletePost = async (
  req,
  res
) => {
  try {
    const postId =
      req.body.postId;

    const userId =
      req?.user?.id ||
      req?.user?._id ||
      req?.body?.userId;


    if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "Both postId and userId are required",
      });
    }


    const post =
      await Post.findById(postId);


    if (!post) {
      return res.status(404).json({
        success: false,
        message:
          "Error while fetching the post",
      });
    }


    // Correct author check
    if (
      String(post.author) !==
      String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "User is not the post owner",
      });
    }


    const deletedPost =
      await Post.findByIdAndDelete(
        postId
      );


    if (!deletedPost) {
      return res.status(500).json({
        success: false,
        message:
          "Could not delete the post",
      });
    }


    // ==================================================
    // REDIS COUNTERS
    // ==================================================

    if (isRedisReady()) {
      try {
        const userLikes =
          Number.parseInt(
            await safeRedisGet(
              `user:${userId}:totalLikes`
            )
          ) || 0;

        const userComments =
          Number.parseInt(
            await safeRedisGet(
              `user:${userId}:totalComments`
            )
          ) || 0;

        const userPosts =
          Number.parseInt(
            await safeRedisGet(
              `user:${userId}:totalPosts`
            )
          ) || 0;


        await safeRedisSet(
          `user:${userId}:totalLikes`,
          Math.max(
            0,
            userLikes -
              (deletedPost.likes?.length ||
                0)
          )
        );

        await safeRedisSet(
          `user:${userId}:totalComments`,
          Math.max(
            0,
            userComments -
              (deletedPost.comments?.length ||
                0)
          )
        );

        await safeRedisSet(
          `user:${userId}:totalPosts`,
          Math.max(
            0,
            userPosts - 1
          )
        );


        // Remove cached post
        await safeRedisDelete(
          `post:${postId}`
        );


        await client.lRem(
          "posts:ids",
          0,
          postId.toString()
        );

      } catch (redisError) {
        console.error(
          "Redis delete error:",
          redisError.message
        );
      }
    }


    // ==================================================
    // UPDATE USER
    // ==================================================

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            posts: postId,
          },
        },
        {
          new: true,
        }
      );


    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message:
          "Couldnt update the user's posts",
      });
    }


    // ==================================================
    // GET UPDATED POSTS
    // ==================================================

    let posts = [];

    if (isRedisReady()) {
      try {
        const postIds =
          await client.lRange(
            "posts:ids",
            0,
            -1
          );

        const cachedPosts =
          await Promise.all(
            postIds.map(
              (id) =>
                client.get(
                  `post:${id}`
                )
            )
          );

        posts =
          cachedPosts
            .map((item) => {
              try {
                return item
                  ? JSON.parse(item)
                  : null;
              } catch {
                return null;
              }
            })
            .filter(Boolean);

      } catch (redisError) {
        console.error(
          "Redis updated posts error:",
          redisError.message
        );
      }
    }


    if (!posts.length) {
      posts =
        await Post.find()
          .populate("author")
          .populate({
            path: "likes",
          })
          .sort({
            createdAt: -1,
          })
          .exec();
    }


    // ==================================================
    // FIRESTORE
    // ==================================================

    try {
      const docRef =
        db
          .collection("Post")
          .doc(
            deletedPost._id.toString()
          );

      await docRef.delete();


      const userRef =
        db
          .collection("userPosts")
          .doc(
            updatedUser._id.toString()
          );

      await userRef.set({
        author:
          updatedUser.username,
        dp:
          updatedUser.displayPicture,
        posts:
          updatedUser.posts.length,
      });

    } catch (firestoreError) {
      console.error(
        "Firestore delete error:",
        firestoreError.message
      );
    }


    return res.status(200).json({
      success: true,
      message:
        "Post has been deleted successfully",
      posts,
    });

  } catch (error) {
    console.error(
      "Delete post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error while deleting the post",
    });
  }
};


// ======================================================
// GET ALL POSTS
// ======================================================

exports.getPosts = async (
  req,
  res
) => {
  try {

    // IMPORTANT:
    // count is now received as query parameter
    // /get-post?count=4

    let count =
      Number(req.query.count) || 4;


    if (!Number.isFinite(count) || count < 1) {
      count = 4;
    }


    count = Math.floor(count);


    let posts = [];


    // ==================================================
    // REDIS
    // ==================================================

    if (isRedisReady()) {
      try {

        const postIds =
          await client.lRange(
            "posts:ids",
            0,
            -1
          );


        if (
          postIds &&
          postIds.length > 0
        ) {

          const cachedPosts =
            await Promise.all(
              postIds.map(
                (id) =>
                  client.get(
                    `post:${id}`
                  )
              )
            );


          posts =
            cachedPosts
              .map((item) => {
                try {
                  return item
                    ? JSON.parse(item)
                    : null;
                } catch (parseError) {
                  console.error(
                    "Redis post parse error:",
                    parseError.message
                  );

                  return null;
                }
              })
              .filter(Boolean);
        }

      } catch (redisError) {

        console.error(
          "Redis getPosts error:",
          redisError.message
        );

        posts = [];
      }
    }


    // ==================================================
    // REDIS POSTS FOUND
    // ==================================================

    if (posts.length > 0) {

      const totalLength =
        posts.length;

      const slicedPost =
        posts.slice(
          0,
          Math.min(
            count,
            totalLength
          )
        );


      return res.status(200).json({
        success: true,
        message:
          "Posts fetched successfully",
        slicedPost,
        totalLength,
      });
    }


    // ==================================================
    // MONGODB FALLBACK
    // ==================================================

    posts =
      await Post.find()
        .populate("author")
        .populate({
          path: "likes",
        })
        .sort({
          createdAt: -1,
        })
        .exec();


    const totalLength =
      posts.length;


    const slicedPost =
      posts.slice(
        0,
        Math.min(
          count,
          totalLength
        )
      );


    // ==================================================
    // CACHE MONGODB POSTS
    // ==================================================

    if (
      isRedisReady() &&
      posts.length > 0
    ) {
      try {

        // Clear old list so stale IDs
        // don't remain in Redis
        await client.del(
          "posts:ids"
        );


        // Keep newest posts first
        const ids =
          posts.map(
            (post) =>
              post._id.toString()
          );


        for (const id of ids.reverse()) {
          await client.lPush(
            "posts:ids",
            id
          );
        }


        await Promise.all(
          posts.map(
            async (post) => {
              await client.set(
                `post:${post._id}`,
                JSON.stringify(post)
              );
            }
          )
        );

      } catch (redisError) {

        console.error(
          "Redis cache save error:",
          redisError.message
        );
      }
    }


    return res.status(200).json({
      success: true,
      message:
        "Posts fetched successfully",
      slicedPost,
      totalLength,
    });

  } catch (error) {

    console.error(
      "Error while fetching posts:",
      error
    );

    // IMPORTANT:
    // Don't return success:true when database fails.
    return res.status(500).json({
      success: false,
      message:
        "Could not get all posts",
    });
  }
};


// ======================================================
// GET USER POSTS
// ======================================================

exports.getUserPosts = async (
  req,
  res
) => {
  try {

    const userId =
      req.headers.userid ||
      req.query.userId ||
      req.user?.id;


    if (!userId) {
      return res.status(400).json({
        success: false,
        message:
          "Provide the user id",
      });
    }


    let count =
      Number(req.query.count) || 4;


    if (
      !Number.isFinite(count) ||
      count < 1
    ) {
      count = 4;
    }


    count = Math.floor(count);


    // ==================================================
    // REDIS
    // ==================================================

    let posts = [];


    if (isRedisReady()) {
      try {

        const postIds =
          await client.lRange(
            "posts:ids",
            0,
            -1
          );


        const cachedPosts =
          await Promise.all(
            postIds.map(
              (id) =>
                client.get(
                  `post:${id}`
                )
            )
          );


        posts =
          cachedPosts
            .map((item) => {
              try {
                return item
                  ? JSON.parse(item)
                  : null;
              } catch {
                return null;
              }
            })
            .filter(Boolean);


        posts =
          posts.filter(
            (post) =>
              String(
                post?.author?._id ||
                post?.author
              ) ===
              String(userId)
          );

      } catch (redisError) {

        console.error(
          "Redis user posts error:",
          redisError.message
        );

        posts = [];
      }
    }


    if (posts.length > 0) {

      const totalLength =
        posts.length;

      const slicedPost =
        posts.slice(
          0,
          Math.min(
            count,
            totalLength
          )
        );


      return res.status(200).json({
        success: true,
        message:
          "Posts fetched successfully",
        slicedPost,
        totalLength,
      });
    }


    // ==================================================
    // MONGODB FALLBACK
    // ==================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user id",
      });
    }


    posts =
      await Post.find({
        author:
          new mongoose.Types.ObjectId(
            userId
          ),
      })
        .populate("author")
        .populate({
          path: "likes",
        })
        .sort({
          createdAt: -1,
        })
        .exec();


    const totalLength =
      posts.length;


    const slicedPost =
      posts.slice(
        0,
        Math.min(
          count,
          totalLength
        )
      );


    return res.status(200).json({
      success: true,
      message:
        "Posts fetched for the user",
      slicedPost,
      totalLength,
    });

  } catch (error) {

    console.error(
      "Get user posts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Couldnt get the posts for the user",
    });
  }
};


// ======================================================
// GET USER POST STATS
// ======================================================

exports.getUserPostsStats = async (
  req,
  res
) => {
  try {

    const userId =
      req.user?.id ||
      req.user?._id;


    if (!userId) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }


    // ==================================================
    // REDIS COUNTERS
    // ==================================================

    if (isRedisReady()) {

      try {

        const totalPosts =
          Number.parseInt(
            await safeRedisGet(
              `user:${userId}:totalPosts`
            )
          );

        const totalLikes =
          Number.parseInt(
            await safeRedisGet(
              `user:${userId}:totalLikes`
            )
          );

        const totalComments =
          Number.parseInt(
            await safeRedisGet(
              `user:${userId}:totalComments`
            )
          );


        if (
          Number.isFinite(totalPosts) &&
          Number.isFinite(totalLikes) &&
          Number.isFinite(totalComments)
        ) {

          return res.status(200).json({
            success: true,
            message:
              "User Posts Stats fetched successfully",
            data: {
              postLength:
                totalPosts,
              likesLength:
                totalLikes,
              commentsLength:
                totalComments,
            },
          });
        }

      } catch (redisError) {

        console.error(
          "Redis stats error:",
          redisError.message
        );
      }
    }


    // ==================================================
    // MONGODB FALLBACK
    // ==================================================

    const posts =
      await Post.find({
        author: userId,
      });


    const postLength =
      posts.length;

    let likesLength = 0;
    let commentsLength = 0;


    posts.forEach((post) => {

      likesLength +=
        post?.likes?.length || 0;

      commentsLength +=
        post?.comments?.length || 0;
    });


    const data = {
      postLength,
      likesLength,
      commentsLength,
    };


    // Save stats in Redis
    if (isRedisReady()) {
      await safeRedisSet(
        `user:${userId}:totalPosts`,
        postLength
      );

      await safeRedisSet(
        `user:${userId}:totalLikes`,
        likesLength
      );

      await safeRedisSet(
        `user:${userId}:totalComments`,
        commentsLength
      );
    }


    return res.status(200).json({
      success: true,
      message:
        "User Posts Stats fetched successfully",
      data,
    });

  } catch (error) {

    console.error(
      "User Post Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};


// ======================================================
// REPORT POST
// ======================================================

exports.reportPost = async (
  req,
  res
) => {

  try {

    const postId =
      req.body.postId;


    if (!postId) {
      return res.status(400).json({
        success: false,
        message:
          "PostId not found",
      });
    }


    const post =
      await Post.findById(
        postId
      );


    if (!post) {
      return res.status(404).json({
        success: false,
        message:
          "Post not found",
      });
    }


    // ==================================================
    // REDIS CACHE
    // ==================================================

    let cachedPost = null;


    if (isRedisReady()) {
      const cached =
        await safeRedisGet(
          `post:${postId}`
        );

      if (cached) {
        try {
          cachedPost =
            JSON.parse(cached);
        } catch {
          cachedPost = null;
        }
      }
    }


    // ==================================================
    // INCREMENT REPORT
    // ==================================================

    post.reports =
      (post.reports || 0) + 1;

    await post.save();


    const userId =
      post.author;


    // ==================================================
    // DELETE POST AFTER 3 REPORTS
    // ==================================================

    if (
      post.reports >= 3
    ) {

      const deletedPost =
        await Post.findByIdAndDelete(
          postId
        );


      if (isRedisReady()) {

        await client.lRem(
          "posts:ids",
          0,
          postId.toString()
        );

        await safeRedisDelete(
          `post:${postId}`
        );
      }


      const user =
        await User.findById(
          userId
        );


      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }


      user.posts =
        user.posts.filter(
          (item) =>
            String(item) !==
            String(deletedPost._id)
        );


      user.reports =
        (user.reports || 0) + 1;


      await user.save();


      // ==================================================
      // FIRESTORE DELETE
      // ==================================================

      try {

        const docRef =
          db
            .collection("Post")
            .doc(
              deletedPost._id.toString()
            );

        await docRef.delete();


        const userRef =
          db
            .collection("userPosts")
            .doc(
              user._id.toString()
            );


        await userRef.set({
          author:
            user.username,
          dp:
            user.displayPicture,
          posts:
            user.posts.length,
        });

      } catch (firestoreError) {

        console.error(
          "Firestore report delete error:",
          firestoreError.message
        );
      }


      // ==================================================
      // DELETE USER AFTER 5 REPORTS
      // ==================================================

      if (
        user.reports >= 5
      ) {

        const deletedUser =
          await User.findByIdAndDelete(
            userId
          );


        if (!deletedUser) {
          return res.status(500).json({
            success: false,
            message:
              `Couldnt delete the reported user ${user?.name}`,
          });
        }


        if (isRedisReady()) {
          await safeRedisDelete(
            `user:${userId}`
          );
        }


        try {

          const userRef =
            db
              .collection("userPosts")
              .doc(
                userId.toString()
              );

          await userRef.delete();


          const postPromises =
            deletedUser.posts.map(
              (post) => {

                const postId =
                  post.toString();

                return db
                  .collection("Post")
                  .doc(postId)
                  .delete();
              }
            );


          await Promise.all(
            postPromises
          );

        } catch (firestoreError) {

          console.error(
            "Firestore user delete error:",
            firestoreError.message
          );
        }
      }
    }


    // ==================================================
    // RETURN CURRENT POSTS
    // ==================================================

    const posts =
      await Post.find()
        .sort({
          createdAt: -1,
        })
        .populate("author")
        .exec();


    return res.status(200).json({
      success: true,
      message:
        "Post has been reported successfully",
      posts,
    });

  } catch (error) {

    console.error(
      "Report post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error while reporting the post",
    });
  }
};


// ======================================================
// DELETE ALL POSTS
// ======================================================

exports.deleteAllPosts = async (
  req,
  res
) => {

  try {

    const userId =
      req.user?.id ||
      req.user?._id;


    if (!userId) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide user id",
      });
    }


    const deletedPosts =
      await Post.find({
        author: userId,
      });


    await Post.deleteMany({
      author: userId,
    });


    // ==================================================
    // REDIS
    // ==================================================

    if (isRedisReady()) {

      try {

        const postIds =
          await client.lRange(
            "posts:ids",
            0,
            -1
          );


        await Promise.all(
          postIds.map(
            (id) =>
              client.del(
                `post:${id}`
              )
          )
        );


        await client.del(
          "posts:ids"
        );


        await safeRedisSet(
          `user:${userId}:totalPosts`,
          0
        );

        await safeRedisSet(
          `user:${userId}:totalLikes`,
          0
        );

        await safeRedisSet(
          `user:${userId}:totalComments`,
          0
        );

      } catch (redisError) {

        console.error(
          "Redis delete all error:",
          redisError.message
        );
      }
    }


    // ==================================================
    // UPDATE USER
    // ==================================================

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          posts: [],
        },
      }
    );


    return res.status(200).json({
      success: true,
      message:
        "Posts deleted successfully for the user",
      deletedPosts,
    });

  } catch (error) {

    console.error(
      "Delete all posts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Some error occurred while deleting all the posts for this user",
    });
  }
};


// ======================================================
// POST EXISTS
// ======================================================

exports.postExist = async (
  req,
  res
) => {

  try {

    const postId =
      req.query.postid ||
      req.body?.postId ||
      req.body?.postid ||
      req.headers?.postid;


    if (!postId) {
      return res.status(400).json({
        success: false,
        message:
          "PostId not found",
      });
    }


    const post =
      await Post.findById(
        postId
      )
        .populate("author")
        .populate({
          path: "likes",
        })
        .exec();


    if (!post) {
      return res.status(404).json({
        success: false,
        message:
          "Post not found",
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Post exists",
      post,
    });

  } catch (error) {

    console.error(
      "Post exists error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error while checking the post",
    });
  }
};
