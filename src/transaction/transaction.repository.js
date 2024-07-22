import { getDocs, collection, where, query, getDoc, updateDoc, doc } from "firebase/firestore";
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
};

export const findTransactionById = async (transactionId) => {
  const docRef = doc(db, "transactions", transactionId);
  const docSnap = await getDoc(docRef);


  if (!docSnap.exists()) throw Error("Invalid transaction id!");

  const transaction = docSnap.data();

  return transaction;
};

export const updateTransactionById = async (transactionData) => {
  const { recipientName, transactionId, shipmentProof } = transactionData;

  const docRef = doc(db, "transactions", transactionId);

  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("Invalid transaction id");

  await updateDoc(docRef, {
    recipientName,
    shipmentProof,
    status: "Selesai",
  });

  return `Transaksi dengan id: ${transactionId} diselesaikan`;
};
