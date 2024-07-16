import { dropProductById, findProductsByStore, findStore, findStoreProductsByKeyWords, insertProduct, insertStore, updateProductById } from "./store.repository.js";
import { getProductById } from "./../product/product.services.js";

export const getStoreById = async (storeId) => {
  const storeData = await findStore(storeId);

  return storeData;
};

export const getProductsByStore = async (storeId, page, limitValue) => {
  const {products, totalItems} = await findProductsByStore(storeId, page, limitValue);
  const totalPages = Math.ceil(totalItems / limitValue);

  return { products, totalItems, totalPages };
};

export const getStoreProductsByKeyword = async (storeId, keyword) => {
  const searchedProducts = await findStoreProductsByKeyWords(storeId, keyword);

  return searchedProducts;
};

export const createStore = async (storeData) => {
  const createdStore = await insertStore(storeData);
  return createdStore;
};

export const createProduct = async (productData) => {
  const newProduct = await insertProduct(productData);

  return newProduct;
};

export const deleteProductById = async (productId) => {
  await getProductById(productId);

  await dropProductById(productId);
};

export const editProductById = async (productId, productNewData) => {
  await getProductById(productId);

  const updatedProduct = await updateProductById(productId, productNewData);
  return updatedProduct;
};
