import express from "express";
import { createChatroom, createChatroomMessage, editChatroomExpiry, editChatroomsUserData, getChatPartnerData, getChatroomById, getChatroomByParticipants } from "./chatroom.services.js";

const chatroomController = express.Router();

// GET CHATROOM DATA BY CHATROOM ID
chatroomController.get("/:chatroomId", async (req, res) => {
  try {
    const chatroomData = await getChatroomById(req.params.chatroomId);

    res.status(200).json(chatroomData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET CHATROOM DATA BY PARTICIPANTS
chatroomController.get("/participants/:mainUserId/:chatPartnerId", async (req, res) => {
  try {
    const { mainUserId, chatPartnerId } = req.params;
    const chatroom = await getChatroomByParticipants(mainUserId, chatPartnerId);

    res.status(200).json(chatroom);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET CHAT PARTNER DATA
chatroomController.get("/:chatroomId/chatPartner", async (req, res) => {
  try {
    const {mainUserId} = req.query;
    const chatroomId = req.params.chatroomId;

    const chatPartnerData = await getChatPartnerData(chatroomId, mainUserId);
    
    res.status(200).json(chatPartnerData);




  } catch (error) {
    res.status(400).send(error.message);
  }
}) 


// chatroomController.get("/users/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const chatroomData = await getChatroomByUser(userId);

//     res.status(200).json(chatroomData);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

chatroomController.post("/", async (req, res) => {
  try {
    const { mainUserData, chatPartnerData } = req.body;
    const newChatroom = await createChatroom(mainUserData, chatPartnerData);

    res.status(200).json(newChatroom);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

chatroomController.post("/:chatroomId/message", async (req, res) => {
  try {
    const message = req.body;
    const chatroomId = req.params.chatroomId;

    const isSuccess = await createChatroomMessage(chatroomId, message);

    res.status(200).json(isSuccess);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

chatroomController.patch("/:chatroomId/expiry", async (req, res) => {
  try {
    const isSuccess = await editChatroomExpiry(req.params.chatroomId);

    res.status(200).json(isSuccess);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

chatroomController.patch("/users/:userId", async (req, res) => {
  try {
    const { userData, userNewData } = req.body;
    const updatedChatrooms = await editChatroomsUserData(userData, userNewData);

    res.status(200).json(updatedChatrooms);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { chatroomController };
