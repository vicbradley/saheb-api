import { findAllProduct, findProductById } from "./product.repository.js"

export const getAllProduct = async () => {
  const products = await findAllProduct();

  return products;
}

export const getProductById = async (productId) => {
  const product = await findProductById(productId);
  if (!product) throw Error("Product Not Found");

  return product;
}