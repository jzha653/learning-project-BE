import express from 'express';
import userRouter from './User/router';
import transactionRouter from './Transaction/router';

const app = express();
app.use('/user', userRouter);
app.use('/transaction', transactionRouter);
module.exports = {app};
