import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { setDevice } from "../../slices/notificationSlice";

import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../api";

import { toast } from "react-hot-toast";

const {
  LOGIN_API,
  SENDOTP_API,
  SIGNUP_API,
  RESETPASSWORD_API,
  RESETPASSTOKEN_API,
  VALIDATE_SIGNUP,
} = authEndpoints;


// ======================================================
// VALIDATE SIGNUP
// ======================================================

export function validateSignup(email, username, usn) {
  return async (dispatch) => {
    try {
      if (!email || !username || !usn) {
        toast.error("Email, username and USN are required");
        return false;
      }

      const formData = new FormData();

      formData.append("email", email.trim());
      formData.append("username", username.trim());
      formData.append("usn", usn.trim());

      const response = await apiConnector(
        "POST",
        VALIDATE_SIGNUP,
        formData
      );

      console.log(
        "VALIDATE SIGNUP RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Signup validation failed"
        );

        return false;
      }

      return response.data?.flag === true;

    } catch (error) {
      console.error(
        "VALIDATE SIGNUP ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Signup validation failed. Please try again."
      );

      return false;
    }
  };
}


// ======================================================
// SEND OTP
// ======================================================

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...");

    dispatch(setLoading(true));

    try {
      if (!email?.trim()) {
        throw new Error("Email is required");
      }

      const response = await apiConnector(
        "POST",
        SENDOTP_API,
        {
          email: email.trim(),
        }
      );

      console.log(
        "SEND OTP RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to send OTP"
        );
      }

      toast.success(
        "OTP Sent Successfully"
      );

      navigate("/otp");

      return true;

    } catch (error) {
      console.error(
        "SEND OTP ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send OTP. Please try again."
      );

      return false;

    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// ======================================================
// SIGN UP
// ======================================================

export function signUp(
  accountType,
  name,
  username,
  usn,
  email,
  password,
  confirmPassword,
  gender,
  branch,
  year,
  avatar,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading(
      "Creating account..."
    );

    dispatch(setLoading(true));

    try {
      // ------------------------------
      // Validation
      // ------------------------------

      if (!name?.trim()) {
        throw new Error("Name is required");
      }

      if (!username?.trim()) {
        throw new Error("Username is required");
      }

      if (!usn?.trim()) {
        throw new Error("USN is required");
      }

      if (!email?.trim()) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      if (!confirmPassword) {
        throw new Error(
          "Confirm Password is required"
        );
      }

      if (password !== confirmPassword) {
        throw new Error(
          "Password and Confirm Password do not match"
        );
      }

      if (!gender) {
        throw new Error("Gender is required");
      }

      if (!otp) {
        throw new Error("OTP is required");
      }

      // ------------------------------
      // FormData
      // ------------------------------

      const formData = new FormData();

      formData.append(
        "accountType",
        accountType || "Student"
      );

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "username",
        username.trim()
      );

      formData.append(
        "usn",
        usn.trim()
      );

      formData.append(
        "email",
        email.trim()
      );

      formData.append(
        "password",
        password
      );

      formData.append(
        "confirmPassword",
        confirmPassword
      );

      formData.append(
        "gender",
        gender
      );

      if (branch) {
        formData.append(
          "branch",
          branch
        );
      }

      if (year) {
        formData.append(
          "year",
          year
        );
      }

      formData.append(
        "otp",
        otp
      );

      // ------------------------------
      // Avatar
      // ------------------------------

      if (
        avatar &&
        typeof File !== "undefined" &&
        avatar instanceof File
      ) {
        formData.append(
          "avatar",
          avatar
        );
      }

      console.log(
        "========== SIGNUP DATA =========="
      );

      console.log({
        accountType,
        name,
        username,
        usn,
        email,
        gender,
        branch,
        year,
        otp,
        hasPassword: !!password,
        hasConfirmPassword: !!confirmPassword,
        hasAvatar:
          typeof File !== "undefined" &&
          avatar instanceof File,
      });

      // ------------------------------
      // Signup API
      // ------------------------------

      const response = await apiConnector(
        "POST",
        SIGNUP_API,
        formData
      );

      console.log(
        "SIGNUP RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Signup failed"
        );
      }

      // ------------------------------
      // Success
      // ------------------------------

      toast.success(
        "Signup Successful"
      );

      sessionStorage.removeItem(
        "avatarBase64"
      );

      sessionStorage.removeItem(
        "avatarName"
      );

      sessionStorage.removeItem(
        "avatarType"
      );

      navigate("/");

      return true;

    } catch (error) {
      console.error(
        "SIGNUP ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Signup failed. Please try again."
      );

      return false;

    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// ======================================================
// LOGIN
// ======================================================

export function login(
  email,
  password,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading(
      "Logging in..."
    );

    dispatch(setLoading(true));

    try {
      if (!email?.trim()) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      const response = await apiConnector(
        "POST",
        LOGIN_API,
        {
          email: email.trim(),
          password,
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Login failed"
        );
      }

      const token =
        response.data.token;

      const user =
        response.data.user;

      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success(
        "Login Successful"
      );

      navigate("/feed");

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );

    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// ======================================================
// RESET PASSWORD
// ======================================================

export function resetPassword(
  password,
  confirmPassword,
  token,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading(
      "Resetting password..."
    );

    dispatch(setLoading(true));

    try {
      if (!password) {
        throw new Error(
          "Password is required"
        );
      }

      if (!confirmPassword) {
        throw new Error(
          "Confirm Password is required"
        );
      }

      if (password !== confirmPassword) {
        throw new Error(
          "Passwords do not match"
        );
      }

      const response = await apiConnector(
        "POST",
        RESETPASSWORD_API,
        {
          password,
          confirmPassword,
          token,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Password reset failed"
        );
      }

      toast.success(
        "Password Reset Successfully"
      );

      navigate("/");

    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Password reset failed."
      );

    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// ======================================================
// LOGOUT
// ======================================================

export function logout(navigate) {
  return async (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setDevice(null));

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.clear();

    toast.success("Logged Out");

    navigate("/");
  };
}


// ======================================================
// PASSWORD RESET TOKEN
// ======================================================

export function getPasswordResetToken(
  email,
  setEmailSent
) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      if (!email?.trim()) {
        throw new Error(
          "Email is required"
        );
      }

      const response = await apiConnector(
        "POST",
        RESETPASSTOKEN_API,
        {
          email: email.trim(),
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to send reset email"
        );
      }

      toast.success(
        "Reset Email Sent"
      );

      setEmailSent(true);

    } catch (error) {
      console.error(
        "RESET TOKEN ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send reset email."
      );

    } finally {
      dispatch(setLoading(false));
    }
  };
}
