import express from "express";
import { addCartItem, orderItems, deleteCartItem, deleteOrderItems, getCartById, checkoutItems } from "./cart.services.js";
import { verifyToken } from "../middleware/auth.js";
import { checkUserValidity } from "../middleware/checkUserValidity.js";
import { checkAdminValidity } from "../middleware/checkAdminValidity.js";

const cartController = express.Router();

cartController.get("/:userId", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await getCartById(userId);

    res.json(cart);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.post("/:userId", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const userId = req.params.userId;
    const productData = req.body;

    const addedProduct = await addCartItem(userId, productData);

    res.status(200).json(addedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.delete("/:userId", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.query.productId;

    await deleteCartItem(userId, productId);

    res.status(200).send("Cart Item Deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.patch("/:userId/order", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderData = req.body;


    await orderItems(userId, orderData);

    res.status(200).send("Cart Items Is Being Paid");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.patch("/:userId/cancel-order", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactionId = req.body.transactionId;

    await deleteOrderItems(userId, transactionId);

    res.status(200).send("Cancel order");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.patch("/:userId/checkout", checkAdminValidity, async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactionId = req.body.transactionId;

    await checkoutItems(userId, transactionId);

    res.status(200).send("Checkout Success");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { cartController };
