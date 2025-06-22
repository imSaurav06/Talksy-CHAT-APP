// useAuthStore.js file
// import axios from "axios";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { Buffer } from "buffer";

// 👇 Ensure Buffer is available globally (important for some socket internals)
if (!window.Buffer) {
  window.Buffer = Buffer;
}

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"; // ✅ Your backend Socket.IO server

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");

          set({ authUser: res.data });
          get().connectSocket();
        } catch (error) {
          console.log("Error in checkAuth:", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data, {
            withCredentials: true, // if your backend uses cookies/sessions
          });
          set({ authUser: res.data.user }); // or res.data.data if your backend returns user under 'data'
          toast.success("Account created successfully"); // or res.data.data if your backend returns user under 'data'

          console.log(res.data);
          console.log("✅ Response data: ", res.data);

          // ✅ Corrected condition

          // check if success is returned from backend

          get().connectSocket();
        } catch (error) {
          console.log(error);
          toast.error(error.response?.data?.message || "Signup failed");
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");

          get().connectSocket(); // Connect socket after successful login
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket(); // Disconnect socket on logout
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(
            error.response?.data?.message || "Failed to update profile"
          );
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket: () => {
        const { authUser, socket } = get();

        // ✅ Check: don't connect if already connected or no user
        if (!authUser || socket?.connected) {
          console.log("❌ No authUser or socket already connected");
          return;
        }

        // ✅ Initialize new socket connection
        const newSocket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
          transports: ["websocket"], // forces WebSocket, optional but cleaner
        });

        // ✅ Store socket in Zustand
        set({ socket: newSocket });

        // ✅ Handle successful connection
        newSocket.on("connect", () => {
          console.log("✅ Socket connected:", newSocket.id);
        });

        // ✅ Handle connection error
        newSocket.on("connect_error", (err) => {
          console.error("❌ Socket connection error:", err.message);
        });

        // ✅ Listen to online users list
        newSocket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
          console.log("👥 Online users:", userIds);
        });
      },

      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),
    {
      name: "auth-storage", // unique key in localStorage
      partialize: (state) => ({ authUser: state.authUser }), // persist only authUser
    }
  )
);
