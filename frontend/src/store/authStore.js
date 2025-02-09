import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/auth"
    : "/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || error.message || "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || error.message || "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || error.message || "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
      set({ isLoading: false, error: null });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || error.message || "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
      set({ isLoading: false, error: null });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || error.message || "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },
}));
