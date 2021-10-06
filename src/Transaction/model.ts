import DB from '../lib/database';
import {EditTransactionDTO, TransactionDTO, TransactionListDTO} from './type';
import userModel from '../User/model';
import {APIError} from '../lib/api-error';
const transactionRef = DB.collection('transactions');

function checkAuth(authToken?: string) {
  const userId = userModel.getUserId(authToken);
  if (!userId) {
    throw new APIError(401, 'Invalid token');
  }
}

function validateTransactionInput(transaction: EditTransactionDTO) {
  if (transaction.type !== 'expense' && transaction.type !== 'income') {
    throw new APIError(422, 'Invalid transaction type');
  }
  if (!transaction.value) {
    throw new APIError(400, 'Transaction value missing');
  }
  if (!transaction.timestamp) {
    throw new APIError(400, 'Transaction timestamp missing');
  }
  if (!transaction.description) {
    throw new APIError(400, 'Transaction description missing');
  }
}

async function getAllTransactions(
  authToken?: string
): Promise<TransactionListDTO> {
  checkAuth(authToken);
  const allTransactions = await transactionRef.get();
  return {
    items: allTransactions.docs.map(doc => doc.data()) as TransactionDTO[],
  };
}

async function createTransaction(
  transaction: EditTransactionDTO,
  authToken?: string
): Promise<TransactionListDTO> {
  checkAuth(authToken);
  validateTransactionInput(transaction);
  try {
    const newTransaction = await transactionRef.add(transaction);
    try {
      await transactionRef
        .doc(newTransaction.id)
        .update({transactionId: newTransaction.id});
      return getAllTransactions(authToken);
    } catch (error) {
      throw new APIError(500, 'DB error');
    }
  } catch (error) {
    throw new APIError(500, 'DB error');
  }
}

async function getTransactionById(transactionId: string, authToken?: string) {
  checkAuth(authToken);
  if (!transactionId) {
    throw new APIError(400, 'No Transaction Id Found');
  }
  try {
    const currentTransaction = (
      await transactionRef.doc(transactionId).get()
    ).data();
    return currentTransaction;
  } catch (error) {
    throw new APIError(404, 'Not Found');
  }
}

async function updateTransaction(
  transaction: EditTransactionDTO,
  authToken?: string,
  transactionId?: string
) {
  checkAuth(authToken);
  validateTransactionInput(transaction);

  if (!transactionId) {
    throw new APIError(400, 'No Transaction Id Found');
  }
  try {
    await transactionRef.doc(transactionId).update(transaction);
    return getAllTransactions(authToken);
  } catch (error) {
    throw new APIError(404, 'Not Found');
  }
}

async function deleteTransaction(transactionId: string, authToken?: string) {
  checkAuth(authToken);
  if (!transactionId) {
    throw new APIError(400, 'No Transaction Id Found');
  }
  try {
    await transactionRef.doc(transactionId).delete();
    return getAllTransactions(authToken);
  } catch (error) {
    throw new APIError(404, 'Not Found');
  }
}

const transactionModel = {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};

export default transactionModel;
