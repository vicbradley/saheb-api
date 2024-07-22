import { findAllTransaction, findTransactionById, findTransactionByUserId, updateTransactionById } from "./transaction.repository.js"

export const getAllTransaction = async () => {
  const transactions = await findAllTransaction();

  return transactions;
}

export const getTransactionByUserId = async (userId) => {
  const transactions = await findTransactionByUserId(userId);

  return transactions;
}

export const getTransactionById = async (transactionId) => {
  const transaction = await findTransactionById(transactionId);

  return transaction;
}

export const editTransactionById = async (transactionData) => {
  const transaction = updateTransactionById(transactionData);

  return transaction;
}