import { dropProductById, findProductsByStore, findStore, insertProduct, insertStore, updateProductById, findProductsByStoreRealTime } from "./store.repository.js";
import {getProductById} from "./../product/product.services.js"

export const getStoreById = async (storeId) => {
  const storeData = await findStore(storeId);
  if (!storeData) throw Error("Store not found");

  return storeData;
};

export const getProductsByStore = async (storeId) => {
  const products = await findProductsByStore(storeId);
  if (products.length < 1) throw Error("Product Not Found");

  return products;
};

export const getProductsByStoreRealtime = async (socket, storeId) => {
  if (!storeId) {
    socket.emit("error", "Store ID is missing");
    return;
  }

  const unsubscribe = findProductsByStoreRealTime(
    storeId,
    (products) => {
      socket.emit("products", products);
    },
    (error) => {
      socket.emit("error", error);
    }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    () => unsubscribe();
  });
}

export const createStore = async (storeData) => {
  const createdStore = await insertStore(storeData);
  return createdStore;
}

export const createProduct = async (productData) => {
  const newProduct = await insertProduct(productData);

  return newProduct;
};

export const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) throw Error("Product not found");

  await dropProductById(productId);
}

export const editProductById = async (productId, productNewData) => {
  const product = await getProductById(productId);
  if (!product) throw Error("Product not found");

  const updatedProduct = await updateProductById(productId, productNewData);
  return updatedProduct;
}