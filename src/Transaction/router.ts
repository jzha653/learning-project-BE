import transactionModel from './model';
import express from 'express';
import {APIError} from '../lib/api-error';
const transactionRouter = express.Router();

transactionRouter.get('/transactions', async (req, res) => {
  try {
    const response = await transactionModel.getAllTransactions(
      req.headers.authorization
    );
    res.status(200).send(response);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.message);
    } else {
      res.status(500).send((error as Error).message ?? 'Internal Server Error');
    }
  }
});

transactionRouter.post('/transactions', async (req, res) => {
  try {
    const transaction = await transactionModel.createTransaction(
      req.body,
      req.headers.authorization
    );
    res.status(200).send(transaction);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.message);
    } else {
      res.status(500).send((error as Error).message ?? 'Internal Server Error');
    }
  }
});

transactionRouter.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await transactionModel.getTransactionById(
      req.params.id,
      req.headers.authorization
    );
    res.status(200).send(transaction);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.message);
    } else {
      res.status(500).send((error as Error).message ?? 'Internal Server Error');
    }
  }
});

transactionRouter.put('/transactions/:id', async (req, res) => {
  try {
    const transaction = await transactionModel.updateTransaction(
      req.body,
      req.params.id,
      req.headers.authorization
    );
    res.status(200).send(transaction);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.message);
    } else {
      res.status(500).send((error as Error).message ?? 'Internal Server Error');
    }
  }
});

transactionRouter.delete('/transactions/:id', async (req, res) => {
  try {
    const transaction = await transactionModel.deleteTransaction(
      req.params.id,
      req.headers.authorization
    );
    res.status(200).send(transaction);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.message);
    } else {
      res.status(500).send((error as Error).message ?? 'Internal Server Error');
    }
  }
});

export default transactionRouter;
