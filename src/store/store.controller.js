// controller.js
import express from "express";
import { createProduct, createStore, deleteProductById, editProductById, getProductsByStore, getStoreById, getStoreProductsByKeyword } from "./store.services.js";
import { verifyToken} from "../middleware/auth.js";
import { checkStoreOwnership } from "../middleware/checkStoreOwnership.js";

const storeController = express.Router();

storeController.get("/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const storeData = await getStoreById(storeId);

    res.status(200).json(storeData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

storeController.get("/:storeId/products", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;

    const { products, totalItems, totalPages } = await getProductsByStore(storeId, page, limit);

    res.status(200).send({ products, totalItems, totalPages, currentPage: page });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

storeController.get("/:storeId/products/search/:keyword", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const keyword = req.params.keyword;

    const searchedProducts = await getStoreProductsByKeyword(storeId, keyword);

    res.status(200).json(searchedProducts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

storeController.post("/", verifyToken, async (req, res) => {
  try {
    const storeData = req.body;
    const createdStore = await createStore(storeData);

    res.status(200).send(createdStore);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

storeController.post("/:storeId/products", verifyToken, checkStoreOwnership, async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await createProduct(productData);

    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

storeController.delete("/:storeId/products/:productId", verifyToken, checkStoreOwnership, async (req, res) => {
  try {
    const productId = req.params.productId;
    await deleteProductById(productId);

    res.status(200).send("Product Deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

storeController.put("/:storeId/products/:productId", verifyToken, checkStoreOwnership, async (req, res) => {
  try {
    const productId = req.params.productId;
    const productNewData = req.body;

    const updatedProduct = await editProductById(productId, productNewData);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { storeController };
