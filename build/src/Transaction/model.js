"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../lib/database"));
const model_1 = __importDefault(require("../User/model"));
const api_error_1 = require("../lib/api-error");
const transactionRef = database_1.default.collection('transactions');
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
    const userId = model_1.default.getUserId(authToken);
    // checkAuth(authToken); remove userid from payload, add userId to database to filter
    const snapshot = await transactionRef
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .get();
    const result = [];
    snapshot.forEach(doc => {
        const t = doc.data();
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
async function createTransaction(transaction, authToken) {
    const userId = model_1.default.getUserId(authToken);
    validateTransactionInput(transaction);
    const newTransaction = await transactionRef.add({ ...transaction, userId });
    await transactionRef
        .doc(newTransaction.id)
        .update({ transactionId: newTransaction.id });
    return getAllTransactions(authToken);
}
async function getTransactionById(transactionId, authToken) {
    //check user id here
    const userId = model_1.default.getUserId(authToken);
    const currentTransaction = (await transactionRef.doc(transactionId).get()).data();
    if (currentTransaction && currentTransaction.userId !== userId) {
        throw new api_error_1.APIError(401, 'Unauthorised');
    }
    return currentTransaction;
}
async function updateTransaction(transaction, transactionId, authToken) {
    var _a;
    const userId = model_1.default.getUserId(authToken);
    validateTransactionInput(transaction);
    if (((_a = (await transactionRef.doc(transactionId).get()).data()) === null || _a === void 0 ? void 0 : _a.userId) !== userId) {
        throw new api_error_1.APIError(401, 'Unauthorised');
    }
    await transactionRef.doc(transactionId).update(transaction);
    return getAllTransactions(authToken);
}
async function deleteTransaction(transactionId, authToken) {
    var _a;
    const userId = model_1.default.getUserId(authToken);
    if (((_a = (await transactionRef.doc(transactionId).get()).data()) === null || _a === void 0 ? void 0 : _a.userId) !== userId) {
        throw new api_error_1.APIError(401, 'Unauthorised');
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
exports.default = transactionModel;
//# sourceMappingURL=model.js.map