import express from "express";
import { createChatroom, createChatroomMessage, editChatroomExpiry, getChatPartnerData, getChatroomByParticipants } from "./chatroom.services.js";
import { verifyToken } from "../middleware/auth.js";
import { checkIsUserInChatroom } from "../middleware/checkIsUserInChatroom.js";

const chatroomController = express.Router();

// GET CHAT PARTNER DATA
chatroomController.get("/:chatroomId/chatPartner", verifyToken, checkIsUserInChatroom, async (req, res) => {
  try {
    const { mainUserId } = req.query;
    const chatroomId = req.params.chatroomId;

    const chatPartnerData = await getChatPartnerData(chatroomId, mainUserId);

    res.status(200).json(chatPartnerData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET CHATROOM DATA BY PARTICIPANTS
chatroomController.get("/participants", verifyToken, checkIsUserInChatroom, async (req, res) => {
  try {
    const { mainUserId, chatPartnerId } = req.query;

    const chatroom = await getChatroomByParticipants(mainUserId, chatPartnerId);

    res.status(200).json(chatroom);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// CREATE CHATROOM
chatroomController.post("/", verifyToken, async (req, res) => {
  try {
    const { mainUserData, chatPartnerData } = req.body;

    if (mainUserData.uid !== req.userId) {
      return res.status(401).send({ message: "Invalid User!" });
    }

    const newChatroom = await createChatroom(mainUserData, chatPartnerData);

    res.status(200).json(newChatroom);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// INSERT CHATROOM MESSAGE
chatroomController.post("/:chatroomId/message", verifyToken, async (req, res) => {
  try {
    const message = req.body;
    const chatroomId = req.params.chatroomId;

    if (message.senderId !== req.userId) {
      return res.status(401).send({ message: "Invalid User!" });
    }

    const isSuccess = await createChatroomMessage(chatroomId, message);

    res.status(200).json(isSuccess);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// UPDATE CHATROOM EXPIRY
chatroomController.patch("/:chatroomId/expiry", verifyToken, async (req, res) => {
  try {
    const isSuccess = await editChatroomExpiry(req.params.chatroomId);

    res.status(200).json(isSuccess);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { chatroomController };
