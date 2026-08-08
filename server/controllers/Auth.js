import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../api";
import { setDevice } from "../../slices/notificationSlice";

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
    let result = false;

    try {
      const formData = new FormData();

      formData.append("email", email || "");
      formData.append("username", username || "");
      formData.append("usn", usn || "");

      const response = await apiConnector(
        "POST",
        VALIDATE_SIGNUP,
        formData
      );

      console.log("VALIDATE SIGNUP RESPONSE:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Signup validation failed"
        );
      }

      result = response.data.flag;

    } catch (error) {
      console.error(
        "validateSignup API ERROR............",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Signup validation failed. Please try again."
      );

      result = false;
    }

    return result;
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
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await apiConnector(
        "POST",
        SENDOTP_API,
        {
          email,
        }
      );

      console.log("SEND OTP RESPONSE:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to send OTP"
        );
      }

      toast.success("OTP Sent Successfully");

      navigate("/otp");

    } catch (error) {
      console.error(
        "SENDOTP API ERROR............",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send OTP. Please try again."
      );

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
    const toastId = toast.loading("Creating account...");

    dispatch(setLoading(true));

    try {
      // ================================================
      // Basic validation
      // ================================================

      if (!name) {
        throw new Error("Name is required");
      }

      if (!username) {
        throw new Error("Username is required");
      }

      if (!email) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      if (!confirmPassword) {
        throw new Error("Confirm Password is required");
      }

      if (!gender) {
        throw new Error("Gender is required");
      }

      if (!otp) {
        throw new Error("OTP is required");
      }


      // ================================================
      // FormData
      // ================================================

      const formData = new FormData();

      formData.append(
        "accountType",
        accountType || "Student"
      );

      formData.append(
        "name",
        name || ""
      );

      formData.append(
        "username",
        username || ""
      );

      formData.append(
        "usn",
        usn || ""
      );

      formData.append(
        "email",
        email || ""
      );

      formData.append(
        "password",
        password || ""
      );

      formData.append(
        "confirmPassword",
        confirmPassword || ""
      );

      formData.append(
        "gender",
        gender || ""
      );

      formData.append(
        "branch",
        branch || ""
      );

      formData.append(
        "year",
        year || ""
      );

      formData.append(
        "otp",
        otp || ""
      );


      // ================================================
      // Avatar
      // ================================================

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }


      // ================================================
      // Debug
      // ================================================

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
        hasAvatar: avatar instanceof File,
      });


      // ================================================
      // API CALL
      // ================================================

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


      // ================================================
      // Success
      // ================================================

      toast.success("Signup Successful");

      // Clear avatar temporary data
      sessionStorage.removeItem("avatarBase64");
      sessionStorage.removeItem("avatarName");
      sessionStorage.removeItem("avatarType");

      navigate("/");

    } catch (error) {

      console.error(
        "SIGNUP API ERROR............",
        error
      );

      console.error(
        "SIGNUP SERVER RESPONSE:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Signup failed. Please try again."
      );

    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// ======================================================
// LOGIN
// ======================================================

export function login(email, password, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading(
      "Logging in..."
    );

    dispatch(setLoading(true));

    try {

      const response = await apiConnector(
        "POST",
        LOGIN_API,
        {
          email,
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

      toast.success("Login Successful");

      // Token
      dispatch(
        setToken(response.data.token)
      );

      // User
      const userImage =
        response.data.user?.image;

      dispatch(
        setUser({
          ...response.data.user,
          image: userImage,
        })
      );

      // Local storage
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      navigate("/feed");

    } catch (error) {

      console.error(
        "LOGIN API ERROR............",
        error
      );

      toast.error(
        `Login Failed: ${
          error.response?.data?.message ||
          error.message ||
          "Please try again."
        }`
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
        "RESETPASSWORD ERROR............",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Password reset failed."
      );

    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
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

    localStorage.clear();
    sessionStorage.clear();

    toast.success("Logged Out");

    navigate("/");
  };
}


// ======================================================
// GET PASSWORD RESET TOKEN
// ======================================================

export function getPasswordResetToken(
  email,
  setEmailSent
) {
  return async (dispatch) => {

    dispatch(setLoading(true));

    try {

      const response = await apiConnector(
        "POST",
        RESETPASSTOKEN_API,
        {
          email,
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
        "Reset password token error",
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
