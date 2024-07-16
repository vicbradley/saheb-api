import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../db/firebase.js";

export const checkAdminValidity = async (req, res, next) => {
  try {
    const q = query(
      collection(db, "admin"),
      where("username", "==", req.body.adminUsername)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    let isValidPassword = false;
    querySnapshot.forEach((doc) => {
      const adminData = doc.data();
      if (adminData.password == req.body.adminPassword) {
        isValidPassword = true;
      }
    });

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};