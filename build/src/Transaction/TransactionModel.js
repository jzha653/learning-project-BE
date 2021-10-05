"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions = {
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
async function createTransaction(transaction) {
    return transaction;
}
async function getTransactionById(transactionId) {
    //try catch here
    return 'Transaction Fond: ' + transactionId;
}
async function updateTransaction(transactionId) {
    //try catch here
    return 'Transaction Update: ' + transactionId;
}
async function deleteTransaction(transactionId) {
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
//# sourceMappingURL=TransactionModel.js.map