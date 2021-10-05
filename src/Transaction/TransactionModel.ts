import {EditTransactionDTO, TransactionListDTO} from './TransactionType';

const transactions: TransactionListDTO = {
  items: [
    {
      transactionId: '132',
      description: '123',
      timestamp: 123,
      value: 1,
      type: 'expense',
    },
  ],
};

async function getAllTransactions() {
  return transactions;
}

async function createTransaction(transaction: EditTransactionDTO) {
  return transaction;
}

async function getTransactionById(transactionId: string) {
  //try catch here
  return 'Transaction Fond: ' + transactionId;
}

async function updateTransaction(transactionId: string) {
  //try catch here
  return 'Transaction Update: ' + transactionId;
}

async function deleteTransaction(transactionId: string) {
  //try catch here
  return 'Transaction Delete: ' + transactionId;
}

module.exports = {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
