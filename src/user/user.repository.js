import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./../db/firebase.js";

export const findUserById = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("User not found!");

  const product = docSnap.data();

  return product;
};

export const updateUserById = async (userId, userNewData) => {
  const { username, profilePicture } = userNewData;
  const userDoc = doc(db, "users", userId);

  const updatedUser = await updateDoc(userDoc, {
    username,
    profilePicture,
  });

  return updatedUser;
};
