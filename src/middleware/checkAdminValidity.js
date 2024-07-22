import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../db/firebase.js";

export const checkAdminValidity = async (req, res, next) => {
  const { adminUsername, adminPassword } = req.body;

  if (!adminUsername || !adminPassword) throw Error("No admin auth sent");

  const q = query(collection(db, "admin"), where("username", "==", adminUsername));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) throw Error("Invalid username or password!");

  const adminDoc = querySnapshot.docs[0].data();

  if (adminDoc.password !== adminPassword) throw Error("Invalid username or password!");

  next();
};
