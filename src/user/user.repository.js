import { doc, getDoc, updateDoc, getDocs, where, collection, query } from "firebase/firestore";
import { db } from "./../db/firebase.js";
import { getUserById } from "./user.services.js";

export const checkUserAuthByToken = async (userData) => {
  const { userId, authToken: authTokenFE } = userData;

  const user = await getUserById(userId);

  const authTokenDB = user.authToken;

  if (!authTokenFE || !authTokenDB) return false;

  if (authTokenFE === authTokenDB) return true;
};

export const findUserById = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  const user = docSnap.data();

  return user;
};

export const updateUserById = async (userId, userOldData, userNewData) => {
  const { username: newUsername, profilePicture: newProfilePicture } = userNewData;
  const { username: oldUsername, profilePicture: oldProfilePicture } = userOldData;
  const userDoc = doc(db, "users", userId);

  await updateDoc(userDoc, {
    username: newUsername,
    profilePicture: newProfilePicture,
  });


  const q = query(
    collection(db, "chatrooms"),
    where("participants", "array-contains", { profilePicture: oldProfilePicture, uid: userId, username: oldUsername })
  );

  const querySnapshot = await getDocs(q);
  const updatePromises = [];

  querySnapshot.forEach((document) => {
    const chatRoomRef = doc(db, "chatrooms", document.id);

    const updatedParticipants = document.data().participants.map((participant) => {
      if (participant.uid === userId) {
        return {
          uid: userId,
          username: newUsername,
          profilePicture: newProfilePicture,
        };
      }
      return participant;
    });

    updatePromises.push(updateDoc(chatRoomRef, {
      participants: updatedParticipants,
    }));
  });

  await Promise.all(updatePromises);

  return `User with id:${userId} successfully updated`;
};

export const updateUserShippingData = async (userId, shippingData) => {
  const userDoc = doc(db, "users", userId);

  const {newAddress, newPhoneNumber} = shippingData;

  await updateDoc(userDoc, {
    address: newAddress,
    phoneNumber: newPhoneNumber,
  });

  return "User Shipping Data Updated";
}

