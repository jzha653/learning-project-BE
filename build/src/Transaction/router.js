"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
const express_1 = __importDefault(require("express"));
const api_error_1 = require("../lib/api-error");
const transactionRouter = express_1.default.Router();
transactionRouter.get('/transactions', async (req, res) => {
    try {
        const response = await model_1.default.getAllTransactions(req.headers.authorization);
        res.status(200).send(response);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.errorMessage);
        }
        else {
            res.status(500).send(error !== null && error !== void 0 ? error : 'Internal Server Error');
        }
    }
});
transactionRouter.post('/transactions', async (req, res) => {
    try {
        const transaction = await model_1.default.createTransaction(req.body, req.headers.authorization);
        res.status(200).send(transaction);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.errorMessage);
        }
        else {
            res.status(500).send(error !== null && error !== void 0 ? error : 'Internal Server Error');
        }
    }
});
transactionRouter.get('/transactions/:id', async (req, res) => {
    try {
        const transaction = await model_1.default.getTransactionById(req.params.id, req.headers.authorization);
        res.status(200).send(transaction);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.errorMessage);
        }
        else {
            res.status(500).send(error !== null && error !== void 0 ? error : 'Internal Server Error');
        }
    }
});
transactionRouter.put('/transactions/:id', async (req, res) => {
    try {
        const transaction = await model_1.default.updateTransaction(req.body, req.headers.authorization, req.params.id);
        res.status(200).send(transaction);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.errorMessage);
        }
        else {
            res.status(500).send(error !== null && error !== void 0 ? error : 'Internal Server Error');
        }
    }
});
transactionRouter.delete('/transactions/:id', async (req, res) => {
    try {
        const transaction = await model_1.default.deleteTransaction(req.params.id, req.headers.authorization);
        res.status(200).send(transaction);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.errorMessage);
        }
        else {
            res.status(500).send(error !== null && error !== void 0 ? error : 'Internal Server Error');
        }
    }
});
exports.default = transactionRouter;
//# sourceMappingURL=router.js.map