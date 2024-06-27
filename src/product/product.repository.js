import { collection, getDocs, doc, getDoc, limit, query, orderBy, startAfter, where } from "firebase/firestore";
import { db } from "./../db/firebase.js";
import MiniSearch from 'minisearch';

export const findAllProduct = async (page, limitValue) => {
  const productCollection = collection(db, "products");

  // Hitung total item
  const totalSnapshot = await getDocs(productCollection);
  const totalItems = totalSnapshot.size;

  // Tentukan offset
  const offset = (page - 1) * limitValue;

  // Buat query untuk paginasi
  let productQuery = query(productCollection, limit(limitValue));
  if (offset > 0) {
    const lastVisibleDoc = totalSnapshot.docs[offset - 1];
    productQuery = query(productCollection, startAfter(lastVisibleDoc), limit(limitValue));
  }

  const snapshot = await getDocs(productQuery);
  const products = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return { products, totalItems };
};

export const findProductsByKeyword = async (query) => {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const miniSearchConfig = {
    fields: ["name", "desc", "storeName"],
    storeFields: ["id", "name", "price", "stock", "desc", "image", "storeName", "storeId"],
  };

  let miniSearch = new MiniSearch(miniSearchConfig);

  miniSearch.addAll(products);

  const results = miniSearch.search(query);

  return results;
};

export const findProductById = async (productId) => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("Product not found!");

  const product = {
    ...docSnap.data(),
    id: productId,
  };

  return product;
};

