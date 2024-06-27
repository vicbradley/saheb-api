import express from "express";
import { addCartItem, orderItems, deleteCartItem, deleteOrderItems,getCartById, checkoutItems } from "./cart.services.js";

const cartController = express.Router();

cartController.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await getCartById(userId);

    res.json(cart);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const productData = req.body;

    const addedProduct = await addCartItem(userId, productData);

    res.status(200).json(addedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // const productData = req.body;
    const productId = req.query.productId
    // console.log({userId, productId})

    await deleteCartItem(userId, productId);

    res.status(200).send("Cart Item Deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.patch("/:userId/order", async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = req.body;

    await orderItems(userId, products);

    res.status(200).send("Cart Items Is Being Paid");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.patch("/:userId/cancel-order", async (req, res) => {
  try {
    const userId = req.params.userId;

    await deleteOrderItems(userId);

    res.status(200).send("Cancel order");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

cartController.patch("/:userId/checkout", async (req, res) => {
  try {
    const userId = req.params.userId;

    await checkoutItems(userId);

    res.status(200).send("Checkout Success");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { cartController };
