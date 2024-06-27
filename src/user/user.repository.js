import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./../db/firebase.js";

export const findUserById = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  const user = docSnap.data();

  return user;
};

export const updateUserById = async (userId, userNewData) => {
  const { username, profilePicture } = userNewData;
  const userDoc = doc(db, "users", userId);

  await updateDoc(userDoc, {
    username,
    profilePicture,
  });

  return `User with id:${userId} successfully updated`;
};
