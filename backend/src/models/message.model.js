import mongoose from "mongoose";
// import mongoosef from "mongoose";

//each message have a sender and a receiver id it cna be text or image or video
const messageSchema = new mongoose.Schema(
  {
    //sender_id is the ref of user who sent the message
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // it is mandatory
    },

    //receiver_id is the ref of user who receive the message
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // it mean it is mandatory
    },

    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },

  { timestamp: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
