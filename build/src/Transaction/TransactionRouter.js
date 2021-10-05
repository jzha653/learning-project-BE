"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactionModel = require('./TransactionModel');
const express = require('express');
const router = express.Router();
// const {v4: uuid} = require('uuid');
router.get('/transactions', async (req, res) => {
    const response = await transactionModel.getAllTransactions();
    res.status(200).send({
        result: response,
    });
});
router.post('/trasactions', async (req, res) => {
    const response = await transactionModel.createTransaction({
        description: '123',
        timestamp: 123,
        value: 1,
        type: 'expense',
    });
    res.status(200).send({
        result: response,
    });
});
router.get('/transactions/:id', async (req, res) => {
    const response = await transactionModel.getTransactionById('1');
    res.status(200).send({
        result: response,
    });
});
router.post('/transactions/:id', async (req, res) => {
    const response = await transactionModel.updateTransaction('1');
    res.status(200).send({
        result: response,
    });
});
router.delete('/transactions/:id', async (req, res) => {
    const response = await transactionModel.deleteTransaction('1');
    res.status(200).send({
        result: response,
    });
});
module.exports = router;
//# sourceMappingURL=TransactionRouter.js.map