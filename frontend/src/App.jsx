// import tailwindConfig from '../tailwind.config'
import "tailwindcss";
import "./App.css";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });



useEffect(() => {
  if (!authUser) checkAuth();
}, []);

useEffect(() => {
  checkAuth();
},[checkAuth]);


  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-11 animate-spin" />
      </div>
    );

  return (
      
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        // iff the user is authenticated, they can access the home page,
        otherwise they are redirected to the login page.
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        // if the user is not authenticated, they can access the signup page,
        otherwise they are redirected to the home page.
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        // if the user is not authenticated, they can access the login page,
        otherwise they are redirected to the home page.
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        // if the user is authenticated, they can access the profile page,
        otherwise they are redirected to the login page.
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
