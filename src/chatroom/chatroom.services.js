import { findUserById } from "../user/user.repository.js";
import {
  findChatPartnerData,
  findChatroomById,
  findChatroomByParticipant,
  findChatroomDataRealTime,
  findChatroomMessagesRealTime,
  insertChatroom,
  insertChatroomMessage,
  updateChatroomExpiry,
  updateChatroomsUserData,
} from "./chatroom.repository.js";

export const getChatroomById = async (chatroomId) => {
  const chatroomData = await findChatroomById(chatroomId);

  return chatroomData;
};

export const getChatroomByParticipants = async (mainUserId, chatPartnerId) => {
  const chatRoom = await findChatroomByParticipant(mainUserId, chatPartnerId);
  if (chatRoom.length < 1) throw Error("Chatroom not found");

  return chatRoom;
};

export const getChatPartnerData = async (chatroomId, mainUserId) => {
  const chatPartnerId = await findChatPartnerData(chatroomId, mainUserId);

  return chatPartnerId;
};

export const getChatroomMessagesRealTime = async (socket, chatroomId, mainUserId) => {
  if (!chatroomId || !mainUserId) {
    socket.emit("error", "Chat Room Id or Main User Id is missing");
    return;
  }

  const unsubscribe = findChatroomMessagesRealTime(
    chatroomId,
    mainUserId,
    (messages) => {
      socket.emit("messages", messages);
    },
    (error) => {
      socket.emit("error", error);
    }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    () => unsubscribe();
  });
};

export const getChatroomsDataRealTime = async (socket, uid) => {
  if (!uid) return;
  const userData = await findUserById(uid);

  const {username, profilePicture} = userData;

  const unsubscribe = findChatroomDataRealTime(
    uid,
    username,
    profilePicture,
    (chatroomsData) => {
      socket.emit("chatrooms data", chatroomsData);
    },
    (error) => {
      socket.emit("error", error);
    }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    () => unsubscribe();
  });
};

export const createChatroom = async (mainUserData, chatPartnerData) => {
  const newChatroom = await insertChatroom(mainUserData, chatPartnerData);

  return newChatroom;
};

export const createChatroomMessage = async (chatroomId, message) => {
  const isSuccess = await insertChatroomMessage(chatroomId, message);

  if (!isSuccess) throw Error("Pesan gagal terkirim");
  return isSuccess;
};

export const editChatroomExpiry = async (chatroomId) => {
  const isSuccess = await updateChatroomExpiry(chatroomId);

  return isSuccess;
};

export const editChatroomsUserData = async (userData, newUserData) => {
  const updatedChatrooms = await updateChatroomsUserData(userData, newUserData);

  return updatedChatrooms;
};
