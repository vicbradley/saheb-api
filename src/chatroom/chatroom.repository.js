import { doc, updateDoc, query, collection, where, getDocs, addDoc, getDoc, arrayUnion, onSnapshot, runTransaction } from "firebase/firestore";
import { db } from "./../db/firebase.js";
import moment from "moment";
import { getUserById } from "../user/user.services.js";
moment().format();

export const findChatroomById = async (chatroomId) => {
  const chatroomRef = doc(db, "chatrooms", chatroomId);
  const chatroomSnap = await getDoc(chatroomRef);

  if (!chatroomSnap.data()) throw Error("Chatroom tidak ditemukan");

  const chatroomData = {
    id: chatroomId,
    ...chatroomSnap.data(),
  };

  return chatroomData;
};

export const findChatroomByParticipant = async (mainUserId, chatPartnerId) => {
  const chatRoomCollection = await getDocs(collection(db, "chatrooms"));

  if (chatRoomCollection.empty) {
    throw Error("Chatroom not found");
  }

  const mainUserFullData = await getUserById(mainUserId);

  const mainUserData = {
    uid: mainUserFullData.uid,
    username: mainUserFullData.username,
    profilePicture: mainUserFullData.profilePicture,
  };

  const chatPartnerFullData = await getUserById(chatPartnerId);
  const chatPartnerData = {
    uid: chatPartnerFullData.uid,
    username: chatPartnerFullData.username,
    profilePicture: chatPartnerFullData.profilePicture,
  };

  const q1 = query(collection(db, "chatrooms"), where("participants", "array-contains", mainUserData));

  const q2 = query(collection(db, "chatrooms"), where("participants", "array-contains", chatPartnerData));

  const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  const commonChatroom = [];

  snapshot1.forEach((doc1) => {
    snapshot2.forEach((doc2) => {
      if (doc1.id === doc2.id) {
        commonChatroom.push({
          id: doc1.id,
          ...doc1.data(),
        });
      }
    });
  });

  if (commonChatroom.length < 1) throw Error("Chatroom not found");

  return commonChatroom[0];
};

export const findChatPartnerData = async (chatroomId, mainUserId) => {
  const chatRoomRef = doc(db, "chatrooms", chatroomId);
  const chatRoomSnap = await getDoc(chatRoomRef);

  const chatExpired = chatRoomSnap.data().chatExpired;

  const chatPartnerId = chatRoomSnap.data().participants.filter((participant) => mainUserId !== participant.uid)[0].uid;

  // const { uid, username, profilePicture } = chatPartnerData;

  const chatPartnerRef = doc(db, "users", chatPartnerId);
  const chatPartnerSnap = await getDoc(chatPartnerRef);

  const { username: chatPartnerUsername, profilePicture: chatPartnerProfilePicture } = chatPartnerSnap.data();

  const chatPartnerData = {
    chatPartnerId,
    chatPartnerUsername,
    chatPartnerProfilePicture,
    chatExpired,
    pricing: chatPartnerSnap.data().isAConsultant ? chatPartnerSnap.data().consultantData.pricing : null,
  };

  return chatPartnerData;
};

export const findChatroomMessagesRealTime = async (chatroomId, mainUserId, onDataCallback, onErrorCallback) => {
  const docRef = doc(db, "chatrooms", chatroomId);

  const unsubscribe = onSnapshot(
    docRef,
    async (document) => {
      const { messages } = document.data();

      if (messages.length < 1) {
        return;
      }
      

      // Membuat transaksi Firestore
      try {
        await runTransaction(db, async (transaction) => {
          const docSnapshot = await transaction.get(docRef);
          const docData = docSnapshot.data();

          // Memperbarui status isRead pesan tertentu yang belum dibaca
          const updatedMessages = docData.messages.map((message) => {
            if (message.senderId !== mainUserId && !message.isRead) {
              message.isRead = true;
            }
            return message;
          });

          // Memperbarui pesan di Firestore dalam transaksi
          transaction.update(docRef, { messages: updatedMessages });

          // Mengirimkan data ke callback
          onDataCallback(updatedMessages);
        });
      } catch (error) {
        onErrorCallback(error);
      }
    },
    (error) => {
      onErrorCallback(error);
    }
  );

  return unsubscribe;
};


export const findChatroomDataRealTime = async (uid, username, profilePicture, onDataCallback, onErrorCallback) => {
  const q = query(collection(db, "chatrooms"), where("participants", "array-contains", { uid, profilePicture, username }));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      let chatroomsData = [];
      let unreadMessageCount = 0;


      querySnapshot.forEach((doc) => {
        const { participants, messages } = doc.data();

        const chatPartner = participants.filter((data) => data.uid !== uid);

        if (messages.length < 1) {
          chatroomsData.push({
            id: doc.id,
            username: chatPartner[0].username,
            profilePicture: chatPartner[0].profilePicture,
            unreadMsg: 0,
            latestMsg: "",
          });
        } else {
          const unreadMsg = messages.filter((msg) => {
            return msg.senderId !== uid && msg.isRead === false;
          }).length;

          const latestMsg = messages[messages.length - 1].text;

          unreadMessageCount += unreadMsg;

          chatroomsData.push({
            id: doc.id,
            username: chatPartner[0].username,
            profilePicture: chatPartner[0].profilePicture,
            unreadMsg,
            latestMsg,
          });
        }
      });


      onDataCallback({
        chatroomsData,
        unreadMessageCount,
      });
    },
    (error) => {
      onErrorCallback(error);
    }
  );

  return unsubscribe;
};

export const insertChatroom = async (mainUserData, chatPartnerData) => {
  const docRef = await addDoc(collection(db, "chatrooms"), {
    messages: [],
    participants: [mainUserData, chatPartnerData],
    chatExpired: moment().add(1, "days")._d.toString(),
    // chatExpired: moment().add(2, "minutes")._d.toString(),
  });

  const chatroomId = docRef.id;

  const docSnap = await getDoc(doc(db, "chatrooms", chatroomId));

  const newChatroom = {
    id: docRef.id,
    ...docSnap.data(),
  };

  return newChatroom;
};

export const insertChatroomMessage = async (chatroomId, message) => {
  const chatRoomRef = doc(db, "chatrooms", chatroomId);

  await updateDoc(chatRoomRef, {
    messages: arrayUnion(message),
  });

  return true;
};

export const updateChatroomExpiry = async (chatroomId) => {
  const chatroomRef = doc(db, "chatrooms", chatroomId);
  const chatroomSnap = await getDoc(chatroomRef);

  if (!chatroomSnap.data()) throw Error("Chatroom tidak ditemukan");

  await updateDoc(doc(db, "chatrooms", chatroomId), {
    // chatExpired: moment().add(30, "minutes")._d.toString(),
    chatExpired: moment().add(15, "minutes")._d.toString(),
  });

  return true;
};

export const updateChatroomsUserData = async (userData, userNewData) => {
  const { uid } = userData;
  const q = query(collection(db, "chatrooms"), where("participants", "array-contains", userData));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (document) => {
    const chatRoomRef = doc(db, "chatrooms", document.id);

    const participant = document.data().participants.filter((participant) => participant.uid !== uid);

    const updatedChatrooms = await updateDoc(chatRoomRef, {
      participants: [
        {
          uid,
          username: userNewData.username,
          profilePicture: userNewData.profilePicture,
        },
        {
          uid: participant[0].uid,
          username: participant[0].username,
          profilePicture: participant[0].profilePicture,
        },
      ],
    });

    return updatedChatrooms;
  });
};
