import { findUserById } from "../user/user.repository.js";
import { dropCartItem, dropOrderItems, findCartById, insertCartItem, insertCheckoutItems, insertOrderItems } from "./cart.repository.js"

export const getCartById = async (userId) => {
  const cart = await findCartById(userId);

  return cart;
}

export const addCartItem = async (userId, productData) => {
  await findUserById(userId);
  const addedProduct = await insertCartItem(userId, productData);

  return addedProduct;
}

export const deleteCartItem = async (userId, productId) => {
  await findUserById(userId);

  await dropCartItem(userId, productId);
}

export const orderItems = async (userId, products) => {
  await findUserById(userId);

  await insertOrderItems(userId, products);
}

export const deleteOrderItems = async (userId) => {
  await findUserById(userId);

  await dropOrderItems(userId);
}

export const checkoutItems = async (userId) => {
  await findUserById(userId);

  await insertCheckoutItems(userId);
}