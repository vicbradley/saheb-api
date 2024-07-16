import { db } from "./../db/firebase.js";
import { getDoc, doc } from "firebase/firestore";

export const checkStoreOwnership = async (req, res, next) => {
  const docRef = doc(db, "stores", req.params.storeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("Store not found");

  const { owner } = docSnap.data();

  if (owner !== req.userId) {
    return res.status(401).send({ message: "User is not the owner!" });
  }
  next();
};
