import { getTransactionById } from "../transaction/transaction.services.js";

export const checkUserTransactionValidity = async (req, res, next) => {
  try {
    const transactionData = await getTransactionById(req.params.transactionId);

    if (transactionData.userId !== req.userId) return res.status(401).json({ message: "Invalid User!" });

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
