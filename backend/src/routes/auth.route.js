//auth.route.js

import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
// router.post("/test" , test);

router.post("/login", login);

router.post("/logout", logout);

//protectRoute is importent to protect routes from unauthenticated users
//if protectRoute is done then updateProfile call
//protectRoute == auth.middleware.js

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
