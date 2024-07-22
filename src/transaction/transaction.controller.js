import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkUserValidity } from "../middleware/checkUserValidity.js";
import { editTransactionById, getAllTransaction, getTransactionById, getTransactionByUserId } from "./transaction.services.js";
import { verifyAPIKey } from "../middleware/verifyAPIKey.js";
import { checkUserTransactionValidity } from "../middleware/checkUserTransactionValidity.js";

const transactionController = express.Router();

transactionController.get("/", verifyAPIKey, async (req, res) => {
  try {
    const transactions = await getAllTransaction();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

transactionController.get("/:transactionId", verifyToken, checkUserTransactionValidity, async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.transactionId);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

transactionController.get("/users/:userId", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const transactions = await getTransactionByUserId(req.params.userId);

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).send(error.message);
  }
});



transactionController.post("/:userId", verifyAPIKey, async (req, res) => {
  try {
    const transaction = await editTransactionById(req.body);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { transactionController };
