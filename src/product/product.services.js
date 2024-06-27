import { query } from "firebase/firestore";
import { findAllProduct, findProductById, findProductsByKeyword } from "./product.repository.js"

export const getAllProduct = async (page, limit) => {
  const { products, totalItems } = await findAllProduct(page, limit);
  const totalPages = Math.ceil(totalItems / limit);

  return { products, totalItems, totalPages };
}

export const getProductsByKeyword = async (query) => {
  const searchedProducts = await findProductsByKeyword(query);

  return searchedProducts;
}

export const getProductById = async (productId) => {
  const product = await findProductById(productId);

  return product;
}