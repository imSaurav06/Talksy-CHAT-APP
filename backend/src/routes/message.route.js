import express from "express";
import{ protectRoute } from "../middleware/auth.middleware.js";
import{getUsersForSidebar , getMessages , sendMessage} from '../controllers/message.controller.js';
const router = express.Router();

router.get("/user", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);


// This route is for sending messages
router.post("/send/:id", protectRoute, sendMessage);
  
 
 

export default router;