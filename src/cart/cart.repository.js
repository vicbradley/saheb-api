import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./../db/firebase.js";
import { findUserById } from "../user/user.repository.js";
import moment from "moment";

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
  const cartSnapshot = await getDoc(cartRef);

  const cartData = cartSnapshot.data();

  const storeIndex = cartData.stores.findIndex((store) => store.storeId === storeId);

  if (storeIndex !== -1) {
    // Jika store sudah ada, tambahkan produk ke store tersebut
    const store = cartData.stores[storeIndex];
    const productIndex = store.products.findIndex((product) => product.id === id);

    if (productIndex !== -1) {
      // Jika produk sudah ada, update jumlah atau detail produk
      store.products[productIndex] = { id, name, price: parseInt(price), stock, image };
    } else {
      // Jika produk belum ada, tambahkan produk baru
      store.products.push({ id, name, price: parseInt(price), stock, image });
    }

    cartData.stores[storeIndex] = store;
    await setDoc(cartRef, cartData);
  } else {
    // Jika store belum ada, tambahkan store baru dengan produk ini
    const newStore = {
      storeId,
      storeName,
      products: [{ id, name, price: parseInt(price), stock, image }],
    };

    await updateDoc(cartRef, {
      stores: arrayUnion(newStore),
    });
  }
};

export const dropCartItem = async (userId, productId) => {
  const cartRef = doc(db, "carts", userId);

  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const cartData = cartDoc.data();
    const updatedStores = cartData.stores
      .map((store) => {
        const updatedProducts = store.products.filter((product) => product.id !== productId);
        return updatedProducts.length > 0 ? { ...store, products: updatedProducts } : null;
      })
      .filter((store) => store !== null);

    if (updatedStores.length > 0) {
      await updateDoc(cartRef, { stores: updatedStores });
    } else {
      await updateDoc(cartRef, { stores: [] });
    }
  }
};

export const insertOrderItems = async (userId, orderData) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  const cartData = cartSnap.data();
  const { paymentProcess, stores } = cartData;

  // Menambahkan orderData ke paymentProcess
  const newPaymentProcess = [...paymentProcess, orderData];

  // Menghapus produk dari stores berdasarkan storeId
  const newStores = stores.reduce((acc, store) => {
    if (store.storeId === orderData.storeId) {
      const updatedProducts = store.products.filter((product) => {
        return !orderData.products.some((orderProduct) => orderProduct.id === product.id);
      });

      // Hanya tambahkan store ke acc jika masih ada produk yang tersisa
      if (updatedProducts.length > 0) {
        acc.push({ ...store, products: updatedProducts });
      }
    } else {
      acc.push(store);
    }
    return acc;
  }, []);

  // Memperbarui dokumen carts
  await updateDoc(cartRef, {
    paymentProcess: newPaymentProcess,
    stores: newStores,
  });
};

export const dropOrderItems = async (userId, transactionId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  const cartData = cartSnap.data();

  // Find index of the transaction with given transactionId
  const index = cartData.paymentProcess.findIndex((item) => item.transactionId === transactionId);

  if (index !== -1) {
    // Remove the transaction from paymentProcess array
    cartData.paymentProcess.splice(index, 1);

    // Update the document in Firestore
    await updateDoc(cartRef, {
      paymentProcess: cartData.paymentProcess,
    });
  } else {
    throw Error(`Transaction with ID ${transactionId} not found in cart.`);
  }
};

export const insertCheckoutItems = async (userId, transactionId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists()) throw Error("No cart found for user.");

  const cartData = cartSnap.data();
  const paymentProcess = cartData.paymentProcess;
  let transactionData = paymentProcess.find((item) => item.transactionId === transactionId);

  if (!transactionData) throw Error("Invalid Transaction Id");

  const userData = await findUserById(userId);
  const { address, phoneNumber } = userData;
  const transactionDate = moment().format("MMMM Do YYYY, h:mm:ss a");

  transactionData = {
    ...transactionData,
    address,
    phoneNumber,
    transactionDate,
    userId,
    status: "Dikirim"
  };

  const transactionRef = doc(db, "transactions", transactionId);
  await setDoc(transactionRef, transactionData);

  const batch = writeBatch(db);

  transactionData.products.forEach((product) => {
    const productRef = doc(db, "products", product.id);
    batch.update(productRef, {
      stock: product.stock - product.quantity,
    });
  });

  await batch.commit();

  const updatedPaymentProcess = paymentProcess.filter((item) => item.transactionId !== transactionId);
  await updateDoc(cartRef, {
    paymentProcess: updatedPaymentProcess,
  });

  console.log("Transaction moved and stock updated successfully.");
};
