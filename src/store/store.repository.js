// store.repository.js
import { db } from "./../db/firebase.js";
import { collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, deleteDoc, updateDoc, limit, startAfter } from "firebase/firestore";
import MiniSearch from "minisearch";

export const findStore = async (storeId) => {
  const docRef = doc(db, "stores", storeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("Store not found");

  const { location, name, profilePicture } = docSnap.data();

  const storeData = {
    id: storeId,
    location,
    name,
    profilePicture,
  };
  return storeData;
};

export const findProductsByStore = async (storeId, page, limitValue) => {
  const productCollection = collection(db, "products");

  // Hitung total item
  const totalSnapshot = await getDocs(query(productCollection, where("storeId", "==", storeId)));
  const totalItems = totalSnapshot.size;

  // Tentukan offset
  const offset = (page - 1) * limitValue;

  // Buat query untuk paginasi
  let productQuery = query(productCollection, where("storeId", "==", storeId), limit(limitValue));

  if (offset > 0) {
    const lastVisibleDoc = totalSnapshot.docs[offset - 1];
    productQuery = query(productCollection, where("storeId", "==", storeId), startAfter(lastVisibleDoc), limit(limitValue));
  }

  const snapshot = await getDocs(productQuery);
  const products = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return { products, totalItems };
};

export const findStoreProductsByKeyWords = async (storeId, keyword) => {
  const q = query(collection(db, "products"), where("storeId", "==", storeId));

  const querySnapshot = await getDocs(q);

  const products = [];

  querySnapshot.forEach((doc) => {
    const data = { ...doc.data(), id: doc.id };

    products.push(data);
  });

  const miniSearchConfig = {
    fields: ["name", "desc", "storeName"],
    storeFields: ["id", "name", "price", "stock", "desc", "image", "storeName", "storeId"],
  };

  let miniSearch = new MiniSearch(miniSearchConfig);

  miniSearch.addAll(products);

  const results = miniSearch.search(keyword);

  return results;
};

export const insertStore = async (storeData) => {
  const { storeId, storeName, storeLocation, storeProfilePicture, ownerId } = storeData;

  // if doc exists then there is the same id, throw error
  const docRef = doc(db, "stores", storeId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) throw Error("Id yang sama sudah digunakan, buat id toko yang berbeda");

  // if query success then there is the same store name, throw error
  const q = query(collection(db, "stores"), where("name", "==", storeName));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs[0]) throw Error("Nama toko sudah digunakan, buat nama toko yang berbeda");

  await setDoc(docRef, {
    name: storeName,
    owner: ownerId,
    location: storeLocation,
    profilePicture: storeProfilePicture,
  });

  const newDocSnap = await getDoc(docRef);
  const newStoreData = newDocSnap.data();

  // update user doc
  await updateDoc(doc(db, "users", ownerId), {
    store: storeId,
  });

  return newStoreData;
};

export const insertProduct = async (productData) => {
  const { name, desc, price, stock, image, storeId, storeName } = productData;

  const productsCollectionRef = collection(db, "products");

  const newProduct = await addDoc(productsCollectionRef, {
    name,
    desc,
    price,
    stock,
    image,
    storeId,
    storeName,
  });

  return newProduct;
};

export const dropProductById = async (productId) => {
  await deleteDoc(doc(db, "products", productId));
};

export const updateProductById = async (productId, productNewData) => {
  const { name, desc, price, stock, image, storeId } = productNewData;

  const productDoc = doc(db, "products", productId);

  await updateDoc(productDoc, {
    name,
    desc,
    price,
    stock,
    image,
    store: storeId,
  });

  return "Product updated successfully";
};
