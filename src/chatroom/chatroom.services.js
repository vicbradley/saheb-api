import { findChatPartnerData, findChatroomByParticipant, insertChatroom, insertChatroomMessage, updateChatroomExpiry } from "./chatroom.repository.js";

export const getChatroomByParticipants = async (mainUserId, chatPartnerId) => {
  const chatRoom = await findChatroomByParticipant(mainUserId, chatPartnerId);
  if (chatRoom.length < 1) throw Error("Chatroom not found");

  return chatRoom;
};

export const getChatPartnerData = async (chatroomId, mainUserId) => {
  const chatPartnerId = await findChatPartnerData(chatroomId, mainUserId);

  return chatPartnerId;
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
