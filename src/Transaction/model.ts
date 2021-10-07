import DB from '../lib/database';
import {EditTransactionDTO, TransactionDTO, TransactionListDTO} from './type';
import userModel from '../User/model';
import {APIError} from '../lib/api-error';
const transactionRef = DB.collection('transactions');

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
  const userId = userModel.getUserId(authToken);
  // checkAuth(authToken); remove userid from payload, add userId to database to filter
  const snapshot = await transactionRef
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();
  const result: TransactionDTO[] = [];
  snapshot.forEach(doc => {
    const t: TransactionDTO = doc.data() as TransactionDTO;
    result.push({
      transactionId: t.transactionId,
      timestamp: t.timestamp,
      description: t.description,
      type: t.type,
      value: t.value,
    });
  });
  //preprocess, return type specify type in variable name
  return {
    items: result,
  };
}

async function createTransaction(
  transaction: EditTransactionDTO,
  authToken?: string
): Promise<TransactionListDTO> {
  const userId = userModel.getUserId(authToken);
  validateTransactionInput(transaction);

  const newTransaction = await transactionRef.add({...transaction, userId});

  await transactionRef
    .doc(newTransaction.id)
    .update({transactionId: newTransaction.id});

  return getAllTransactions(authToken);
}

async function getTransactionById(
  transactionId: string,
  authToken?: string
): Promise<TransactionDTO> {
  //check user id here
  const userId = userModel.getUserId(authToken);
  const currentTransaction = (
    await transactionRef.doc(transactionId).get()
  ).data();
  if (currentTransaction && currentTransaction.userId !== userId) {
    throw new APIError(401, 'Unauthorised');
  }
  return currentTransaction as TransactionDTO;
}

async function updateTransaction(
  transaction: EditTransactionDTO,
  transactionId: string,
  authToken?: string
): Promise<TransactionListDTO> {
  const userId = userModel.getUserId(authToken);
  validateTransactionInput(transaction);
  if (
    (await transactionRef.doc(transactionId).get()).data()?.userId !== userId
  ) {
    throw new APIError(401, 'Unauthorised');
  }
  await transactionRef.doc(transactionId).update(transaction);
  return getAllTransactions(authToken);
}

async function deleteTransaction(
  transactionId: string,
  authToken?: string
): Promise<TransactionListDTO> {
  const userId = userModel.getUserId(authToken);
  if (
    (await transactionRef.doc(transactionId).get()).data()?.userId !== userId
  ) {
    throw new APIError(401, 'Unauthorised');
  }
  await transactionRef.doc(transactionId).delete();
  return getAllTransactions(authToken);
}

const transactionModel = {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};

export default transactionModel;
