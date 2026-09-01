import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1/";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  requestAdminRegistration: (data) => apiClient.post("auth/admin/request", data),
  registerUser: (data) => apiClient.post("auth/user/register", data),
  requestForgotPassword: (identifier) => apiClient.post("auth/forgot-password/request", { identifier }),
  verifyForgotPasswordOTP: (identifier, otp) => apiClient.post("auth/forgot-password/verify", { identifier, otp }),
  resetPassword: (resetToken, newPassword, confirmPassword) => apiClient.post("auth/forgot-password/reset", { resetToken, newPassword, confirmPassword }),
  loginUser: (identifier, password) =>
    apiClient.post("auth/login", {
        identifier,
        password
    }),
    logoutUser: () => apiClient.post("auth/logout")
};