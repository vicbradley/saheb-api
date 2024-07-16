import { findAllTransaction, findTransactionByUserId } from "./transaction.repository.js"

export const getAllTransaction = async () => {
  const transactions = await findAllTransaction();

  return transactions;
}

export const getTransactionByUserId = async (userId) => {
  const transactions = await findTransactionByUserId(userId);

  return transactions;
}