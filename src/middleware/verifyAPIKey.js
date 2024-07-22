import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../db/firebase.js";

export const verifyAPIKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) return res.status(401).json({ message: "No API Key Provided" });

    const q = query(collection(db, "integratedApps"), where("apiKey", "==", apiKey));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return res.status(401).json({ message: "Invalid API Key" });

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
