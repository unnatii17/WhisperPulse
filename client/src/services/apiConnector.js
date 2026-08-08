import axios from "axios";
import { setUser } from "../slices/profileSlice";
import { setToken } from "../slices/authSlice";
import { store } from "../index";
import { toast } from "react-hot-toast";

export const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      const toastId = toast.loading("Session expired, logging out...");

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        store.dispatch(setUser(null));
        store.dispatch(setToken(null));

        toast.dismiss(toastId);
        toast.error("Session Expired, Login again");
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export const apiConnector = (
  method,
  url,
  bodyData,
  headers,
  params
) => {
  // Handle both:
  // { "Content-Type": "application/json" }
  // and
  // { headers: { "Content-Type": "application/json" } }

  const finalHeaders =
    headers?.headers && typeof headers.headers === "object"
      ? headers.headers
      : headers || {};

  return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: finalHeaders,
    params: params || {},
  });
};
