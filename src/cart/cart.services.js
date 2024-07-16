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

export const orderItems = async (userId, orderData) => {
  await findUserById(userId);

  await insertOrderItems(userId, orderData);
}

export const deleteOrderItems = async (userId, transactionId) => {
  await findUserById(userId);

  await dropOrderItems(userId, transactionId);
}

export const checkoutItems = async (userId, transactionId) => {

  await insertCheckoutItems(userId, transactionId);
}