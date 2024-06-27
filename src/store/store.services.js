import { dropProductById, findProductsByStore, findStore, insertProduct, insertStore, updateProductById } from "./store.repository.js";
import {getProductById} from "./../product/product.services.js"

export const getStoreById = async (storeId) => {
  const storeData = await findStore(storeId);

  return storeData;
};

export const getProductsByStore = async (storeId) => {
  const products = await findProductsByStore(storeId);

  return products;
};

// export const getProductsByStoreRealtime = async (socket, storeId) => {
//   if (!storeId) {
//     socket.emit("error", "Store ID is missing");
//     return;
//   }

//   const unsubscribe = findProductsByStoreRealTime(
//     storeId,
//     (products) => {
//       socket.emit("products", products);
//     },
//     (error) => {
//       socket.emit("error", error);
//     }
//   );

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     () => unsubscribe();
//   });
// }

export const createStore = async (storeData) => {
  const createdStore = await insertStore(storeData);
  return createdStore;
}

export const createProduct = async (productData) => {
  const newProduct = await insertProduct(productData);

  return newProduct;
};

export const deleteProductById = async (productId) => {
  await getProductById(productId);

  await dropProductById(productId);
}

export const editProductById = async (productId, productNewData) => {
  await getProductById(productId);

  const updatedProduct = await updateProductById(productId, productNewData);
  return updatedProduct;
}