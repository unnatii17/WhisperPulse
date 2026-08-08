import { toast } from "react-hot-toast";

import {
  setLoading,
  setPost,
  setTotalPosts,
} from "../../slices/postSlice";

import {
  setUserPost,
  setUserTotalPosts,
} from "../../slices/profileSlice";

import { apiConnector } from "../apiConnector";
import { postEndpoints } from "../api";


// =====================================================
// POST ENDPOINTS
// =====================================================

const {
  CREATE_POST_API,
  EDIT_POST_API,
  DELETE_POST_API,
  GET_POST_API,
  GET_USER_POSTS_API,
  REPORT_POST_API,
  GET_USER_POST_STATS_API,
  POST_EXIST_API,
} = postEndpoints;


// =====================================================
// GET USER POSTS
// =====================================================

export function getUserPosts(userId, count, token) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_USER_POSTS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
        {
          count: count,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Could not get user posts"
        );
      }

      dispatch(
        setUserPost(
          response?.data?.slicedPost || []
        )
      );

      dispatch(
        setUserTotalPosts(
          response?.data?.totalLength || 0
        )
      );

      return response.data;

    } catch (err) {
      console.error(
        "GET_POST_BY_USER_API FAILED:",
        err
      );

      console.error(
        "Status:",
        err?.response?.status
      );

      console.error(
        "Server Response:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not get user posts"
      );

      return null;
    }
  };
}


// =====================================================
// GET USER POST STATISTICS
// =====================================================

export function getUserStats(token) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_USER_POST_STATS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Could not get user statistics"
        );
      }

      return response?.data?.data || null;

    } catch (err) {
      console.error(
        "Error in Fetching User Statistics:",
        err
      );

      console.error(
        "Status:",
        err?.response?.status
      );

      console.error(
        "Server Response:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not get user statistics"
      );

      return null;
    }
  };
}


// =====================================================
// GET ALL POSTS
// =====================================================

export function getPosts(count, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "GET",
        GET_POST_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        },
        {
          count: count,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Could not get all posts"
        );
      }

      dispatch(
        setPost(
          response?.data?.slicedPost || []
        )
      );

      dispatch(
        setTotalPosts(
          response?.data?.totalLength || 0
        )
      );

      return response.data;

    } catch (err) {
      console.error(
        "GET_POST_API FAILED:",
        err
      );

      console.error(
        "Status:",
        err?.response?.status
      );

      console.error(
        "Server Response:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not get all posts"
      );

      return null;

    } finally {
      dispatch(setLoading(false));
    }
  };
}


// =====================================================
// CREATE POST
// =====================================================

export function createPost(token, data) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const cleanToken = token
        ? token
            .toString()
            .replace(/^"(.*)"$/, "$1")
        : token;

      const response = await apiConnector(
        "POST",
        CREATE_POST_API,
        data,
        {
          Authorization: `Bearer ${cleanToken}`,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Could not create post"
        );
      }

      dispatch(
        setPost(
          response?.data?.posts || []
        )
      );

      dispatch(
        setTotalPosts(
          response?.data?.postLength || 0
        )
      );

      toast.success(
        "Post is created successfully"
      );

      return response.data;

    } catch (err) {
      console.error(
        "CREATE_POST_API FAILED:",
        err
      );

      console.error(
        "Server error response data:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Could not create post";

      toast.error(message);

      return null;

    } finally {
      dispatch(setLoading(false));
    }
  };
}


// =====================================================
// EDIT POST
// =====================================================

export function editPost(token, data) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        EDIT_POST_API,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Could not edit the post"
        );
      }

      // Update posts if backend returns them
      if (response?.data?.posts) {
        dispatch(
          setPost(response.data.posts)
        );
      }

      toast.success(
        "Post edited successfully"
      );

      return response.data;

    } catch (err) {
      console.error(
        "EDIT_POST_API FAILED:",
        err
      );

      console.error(
        "Server Response:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not edit the post"
      );

      return null;

    } finally {
      dispatch(setLoading(false));
    }
  };
}


// =====================================================
// DELETE POST
// =====================================================

export function deletePost(token, data) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        DELETE_POST_API,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Could not delete the post"
        );
      }

      dispatch(
        setPost(
          response?.data?.posts || []
        )
      );

      if (
        response?.data?.postLength !==
        undefined
      ) {
        dispatch(
          setTotalPosts(
            response.data.postLength
          )
        );
      }

      toast.success(
        "Post is deleted successfully"
      );

      return response.data;

    } catch (err) {
      console.error(
        "DELETE_POST_API FAILED:",
        err
      );

      console.error(
        "Server Response:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not delete the post"
      );

      return null;

    } finally {
      dispatch(setLoading(false));
    }
  };
}


// =====================================================
// REPORT POST
// =====================================================

export function reportPost(token, data) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        REPORT_POST_API,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Could not report the post"
        );
      }

      if (response?.data?.posts) {
        dispatch(
          setPost(response.data.posts)
        );
      }

      toast.success(
        "Post is reported successfully"
      );

      return response.data;

    } catch (err) {
      console.error(
        "REPORT_POST_API FAILED:",
        err
      );

      console.error(
        "Server Response:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not report the post"
      );

      return null;

    } finally {
      dispatch(setLoading(false));
    }
  };
}


// =====================================================
// CHECK WHETHER POST EXISTS
// =====================================================

export function postExist(token, postid) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "POST",
        POST_EXIST_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        },
        {
          postid: postid,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Post not found"
        );
      }

      return response?.data?.post || false;

    } catch (err) {
      console.error(
        "POST_EXIST_API FAILED:",
        err
      );

      console.error(
        "Status:",
        err?.response?.status
      );

      console.error(
        "Server Response:",
        err?.response?.data
      );

      return false;
    }
  };
}
