import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./../db/firebase.js";

export const findAllProduct = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return products;
};

export const findProductById = async (productId) => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("Product not found");

  const product = {
    ...docSnap.data(),
    id: productId,
  };

  return product;
};
