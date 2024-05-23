import express from "express";
import { getAllProduct, getProductById } from "./product.services.js";

const productController = express.Router();

productController.get("/", async (req, res) => {
  try {
    const products = await getAllProduct();
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

productController.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);

    res.json(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default productController;
