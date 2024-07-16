import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkUserValidity } from "../middleware/checkUserValidity.js"
import { getAllTransaction, getTransactionByUserId } from "./transaction.services.js";

const transactionController = express.Router();

transactionController.get("/", async (req, res) => {
  try {
    const transactions = await getAllTransaction();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

transactionController.get("/:userId", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const transactions = await getTransactionByUserId(req.params.userId);

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { transactionController };
