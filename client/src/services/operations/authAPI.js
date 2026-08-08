import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../api";
import { setDevice } from "../../slices/notificationSlice";

// import { auth } from "../../firebase";
// import { signInWithEmailAndPassword, signOut } from "firebase/auth";

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
    let result = true;

    try {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("username", username);
      formData.append("usn", usn);

      // DO NOT manually send Content-Type for FormData
      const response = await apiConnector(
        "POST",
        VALIDATE_SIGNUP,
        formData
      );

      result = response.data.flag;

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.log(
        "validateSignup API ERROR............",
        err
      );

      toast.error(
        err.response?.data?.message ||
          err.message ||
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
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        SENDOTP_API,
        {
          email,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");

      navigate("/otp");
    } catch (error) {
      console.log(
        "SENDOTP API ERROR............",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send OTP. Please try again."
      );
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
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
  instagram,
  avatar,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));

    try {
      const formData = new FormData();

      formData.append("accountType", accountType);
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("gender", gender);
      formData.append("branch", branch);
      formData.append("year", year);
      formData.append("instagram", instagram);
      formData.append("avatar", avatar);
      formData.append("otp", otp);
      formData.append("usn", usn);

      // DO NOT manually send Content-Type for FormData
      const response = await apiConnector(
        "POST",
        SIGNUP_API,
        formData
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Signup Successful");

      navigate("/");
    } catch (error) {
      console.log(
        "SIGNUP API ERROR............",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Signup failed. Please try again."
      );

      navigate("/signup");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}


// ======================================================
// LOGIN
// ======================================================

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");

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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");

      dispatch(setToken(response.data.token));

      const userImage = response.data.user.image;

      dispatch(
        setUser({
          ...response.data.user,
          image: userImage,
        })
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Firebase login if needed
      // const loggedUser =
      //   await signInWithEmailAndPassword(
      //     auth,
      //     email,
      //     password
      //   );

      navigate("/feed");
    } catch (error) {
      console.log(
        "LOGIN API ERROR............",
        error
      );

      toast.error(
        `Login Failed ${
          error.response?.data?.message ||
          error.message ||
          "Please try again."
        }`
      );
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
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
    const toastId = toast.loading("Loading...");

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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(
        "Password Reset Successfully"
      );

      navigate("/");
    } catch (error) {
      console.log(
        "RESETPASSWORD ERROR............",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Password reset failed."
      );
    }

    toast.dismiss(toastId);
    dispatch(setLoading(false));
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

    // await signOut(auth);

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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");

      setEmailSent(true);
    } catch (error) {
      console.log(
        "Reset password token error",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send reset email."
      );
    }

    dispatch(setLoading(false));
  };
}
