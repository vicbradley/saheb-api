import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./../db/firebase.js";
import { getProductById } from "../product/product.services.js";

export const findCartById = async (userId) => {
  const docRef = doc(db, "carts", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.data()) throw Error("User not found!");

  const cart = {
    ...docSnap.data(),
    userId,
  };

  return cart;
};

export const insertCartItem = async (userId, productData) => {
  const { id, name, price, stock, image, storeId, storeName } = productData;

  const cartRef = doc(db, "carts", userId);

  await updateDoc(cartRef, {
    products: arrayUnion({ id, name, price, stock, image, storeId, storeName, amount: 1 }),
  });

  return productData;
};

export const dropCartItem = async (userId, productId) => {
  const cartRef = doc(db, "carts", userId);

  const product = await getProductById(productId);

  const { id, image, name, price, stock, storeId, storeName } = product;

  const obj = { amount: 1, id, image, name, price, stock, storeId, storeName };

  await updateDoc(cartRef, {
    products: arrayRemove(obj),
  });
};

export const insertOrderItems = async (userId, products) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  const { productsBeingPaid } = cartSnap.data();

  await updateDoc(cartRef, {
    products: [],
    productsBeingPaid: [...productsBeingPaid, ...products],
  });
};

export const dropOrderItems = async (userId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  const { products, productsBeingPaid } = cartSnap.data();

  productsBeingPaid.map((product) => {
    product.amount = 1;
  });

  const mergedArray = products.concat(productsBeingPaid.filter((paidProduct) => !products.some((product) => product.id !== paidProduct.id)));

  await updateDoc(cartRef, {
    products: mergedArray,
    productsBeingPaid: [],
  });
};

export const insertCheckoutItems = async (userId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  const { productsBeingPaid = [], paidProducts = [] } = cartSnap.data();

  // Menggabungkan array tanpa duplikasi
  const mergedArray = [...paidProducts];

  productsBeingPaid.forEach((orderItem) => {
    const existingProductIndex = mergedArray.findIndex((paidProduct) => paidProduct.id === orderItem.id);
    if (existingProductIndex === -1) {
      // Jika produk belum ada, tambahkan ke mergedArray
      mergedArray.push(orderItem);
    } else {
      // Jika produk sudah ada, tambahkan jumlahnya
      mergedArray[existingProductIndex].amount += orderItem.amount;
    }
  });

  await updateDoc(cartRef, {
    productsBeingPaid: [],
    paidProducts: mergedArray,
  });

  const updateStockPromises = productsBeingPaid.map(async (product) => {
    const productRef = doc(db, "products", product.id);
    const productSnap = await getDoc(productRef);

    await updateDoc(productRef, {
      stock: parseInt(productSnap.data().stock) - product.amount,
    });
  });

  await Promise.all(updateStockPromises);
};
