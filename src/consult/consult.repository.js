import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../db/firebase.js";

export const findAllConsultant = async () => {
  const q = query(collection(db, "users"), where("isAConsultant", "==", true));

  const querySnapshot = await getDocs(q);

  const consultants = querySnapshot.docs.map((doc) => {
    const { username, profilePicture } = doc.data();

    const { experience, location, pricing, speciality } = doc.data().consultantData;

    return {
      id: doc.id,
      username,
      profilePicture,
      experience,
      location,
      pricing,
      speciality,
    };
  });

  return consultants;
};

export const findToken = async (tokenValue) => {
  const q = query(collection(db, "tokens"), where("token", "==", tokenValue));
  const tokenDocs = await getDocs(q);

  return tokenDocs.docs[0]?.data();
};
