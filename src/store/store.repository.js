// store.repository.js
import { db } from "./../db/firebase.js";
import { collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";

export const findStore = async (storeId) => {
  const docRef = doc(db, "stores", storeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("Store not found");

  const storeData = {
    id: storeId,
    ...docSnap.data(),
  };
  return storeData;
};

export const findProductsByStore = async (storeId) => {
  const q = query(collection(db, "products"), where("storeId", "==", storeId));

  const querySnapshot = await getDocs(q);

  const products = [];

  querySnapshot.forEach((doc) => {
    const data = { ...doc.data(), id: doc.id };

    products.push(data);
  });

  return products;
};

// export const findProductsByStoreRealTime = async (storeId, onDataCallback, onErrorCallback) => {
//   const q = query(collection(db, "products"), where("storeId", "==", storeId));
//   const unsubscribe = onSnapshot(
//     q,
//     (querySnapshot) => {
//       const products = [];
//       querySnapshot.forEach((doc) => {
//         products.push({ ...doc.data(), id: doc.id });
//       });
//       onDataCallback(products);
//     },
//     (error) => {
//       onErrorCallback(error);
//     }
//   );

//   return unsubscribe;
// };

export const insertStore = async (storeData) => {
  const {storeId, storeName, storeLocation, storeProfilePicture, ownerId} = storeData;

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

  const updatedProduct = await updateDoc(productDoc, {
    name,
    desc,
    price,
    stock,
    image,
    store: storeId,
  });

  return updatedProduct;
};
