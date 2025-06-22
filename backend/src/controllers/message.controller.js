import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js"; // Import the io instance

export const getUsersForSidebar = async (req, res) => {
  try {
    // req mean(protectRoute) in message.model.js
    const loggedInUserId = req.user._id;

    // Find all users except the logged in user
    // Return the filtered users
    // The select("-password") is used to exclude the password field from the response
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    //req.params.id is the user id to chat with
    //userToChatId is the user we want to chat with
    const { id: userToChatId } = req.params;

    //myId is the logged in user id
    //req.user is set by protectRoute middleware
    const myId = req.user._id;

    // Find messages between the logged in user and the user to chat with
    // MessageChannel is the model for messages
    // It will find messages where either the sender is the logged in user and the receiver is the user to chat with
   const messages = await Message.find({
  $or: [
    { senderId: myId, receiverId: userToChatId },
    { senderId: userToChatId, receiverId: myId },
  ],
}).sort({ createdAt: 1 }); // oldest to newest
return res.status(200).json(messages);

    // Sort messages by createdAt field in ascending order
   
  } catch (error) {
    // Log the error message for debugging
    // Return a 500 Internal Server Error response
    console.log("Error in getMessages controller: ", error.message);
   
    // ❗ Only runs if an error happens before the 200 response
    // If headers have not been sent yet, send a 500 response
     if (!res.headersSent) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const sendMessage = async (req, res) => {
  try {
    //req.body contains the message data
    const { text, image } = req.body;

    //req.params.id is the receiver's user id
    //req.user is set by protectRoute middleware
    const { id: receiverId } = req.params;

    // Validate input
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      // If an image is provided, upload it to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // The status code 201 indicates that a new resource has been created successfully
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage Controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
