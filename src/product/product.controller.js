import express from "express";
import { getAllProduct, getProductById, getProductsByKeyword } from "./product.services.js";

const productController = express.Router();

productController.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const { products, totalItems, totalPages } = await getAllProduct(page, limit);

    res.status(200).send({ products, totalItems, totalPages, currentPage: page });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

productController.get("/search/:query", async (req, res) => {
  try {
    const searchedProducts = await getProductsByKeyword(req.params.query);

    res.status(200).send(searchedProducts)
  } catch (error) {
    res.status(400).send(error.message);
  }
})

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
