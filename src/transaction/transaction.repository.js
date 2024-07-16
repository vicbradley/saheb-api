import { getDocs, collection, where, query } from "firebase/firestore";
import { db } from "./../db/firebase.js";

export const findAllTransaction = async () => {
  const transactionCollection = collection(db, "transactions");
  const snapshot = await getDocs(transactionCollection);
  const transactions = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return transactions;
};

export const findTransactionByUserId = async (userId) => {
  const q = query(collection(db, "transactions"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const transactions = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));

  return transactions;

  // if (querySnapshot.empty) {
  //   throw Error("No")
  //   return res.status(401).json({ message: "Invalid username or password" });
  // }
};
