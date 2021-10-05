"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const userRouter = require('./User/UserRouter');
app.use('/user', userRouter);
const transactionRouter = require('./Transaction/TransactionRouter');
app.use('/transaction', transactionRouter);
module.exports = { app };
//# sourceMappingURL=index.js.map