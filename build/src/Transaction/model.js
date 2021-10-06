"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../lib/database"));
const model_1 = __importDefault(require("../User/model"));
const api_error_1 = require("../lib/api-error");
const transactionRef = database_1.default.collection('transactions');
function checkAuth(authToken) {
    const userId = model_1.default.getUserId(authToken);
    if (!userId) {
        throw new api_error_1.APIError(401, 'Invalid token');
    }
}
function validateTransactionInput(transaction) {
    if (transaction.type !== 'expense' && transaction.type !== 'income') {
        throw new api_error_1.APIError(422, 'Invalid transaction type');
    }
    if (!transaction.value) {
        throw new api_error_1.APIError(400, 'Transaction value missing');
    }
    if (!transaction.timestamp) {
        throw new api_error_1.APIError(400, 'Transaction timestamp missing');
    }
    if (!transaction.description) {
        throw new api_error_1.APIError(400, 'Transaction description missing');
    }
}
async function getAllTransactions(authToken) {
    checkAuth(authToken);
    const allTransactions = await transactionRef.get();
    return {
        items: allTransactions.docs.map(doc => doc.data()),
    };
}
async function createTransaction(transaction, authToken) {
    checkAuth(authToken);
    validateTransactionInput(transaction);
    try {
        const newTransaction = await transactionRef.add(transaction);
        try {
            await transactionRef
                .doc(newTransaction.id)
                .update({ transactionId: newTransaction.id });
            return getAllTransactions(authToken);
        }
        catch (error) {
            throw new api_error_1.APIError(500, 'DB error');
        }
    }
    catch (error) {
        throw new api_error_1.APIError(500, 'DB error');
    }
}
async function getTransactionById(transactionId, authToken) {
    checkAuth(authToken);
    if (!transactionId) {
        throw new api_error_1.APIError(400, 'No Transaction Id Found');
    }
    try {
        const currentTransaction = (await transactionRef.doc(transactionId).get()).data();
        return currentTransaction;
    }
    catch (error) {
        throw new api_error_1.APIError(404, 'Not Found');
    }
}
async function updateTransaction(transaction, authToken, transactionId) {
    checkAuth(authToken);
    validateTransactionInput(transaction);
    if (!transactionId) {
        throw new api_error_1.APIError(400, 'No Transaction Id Found');
    }
    try {
        await transactionRef.doc(transactionId).update(transaction);
        return getAllTransactions(authToken);
    }
    catch (error) {
        throw new api_error_1.APIError(404, 'Not Found');
    }
}
async function deleteTransaction(transactionId, authToken) {
    checkAuth(authToken);
    if (!transactionId) {
        throw new api_error_1.APIError(400, 'No Transaction Id Found');
    }
    try {
        await transactionRef.doc(transactionId).delete();
        return getAllTransactions(authToken);
    }
    catch (error) {
        throw new api_error_1.APIError(404, 'Not Found');
    }
}
const transactionModel = {
    getAllTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};
exports.default = transactionModel;
//# sourceMappingURL=model.js.map