import express from 'express';
import {APIError} from '../lib/api-error';
import userModel from './model';
import {UserLoginDTO, UserSignupDTO, CustomRequest} from './type';

const userRouter = express.Router();

userRouter.post('/signup', async (req: CustomRequest<UserSignupDTO>, res) => {
  try {
    // move to model
    const response = await userModel.signUp(req.body);
    res.status(201).send(response);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.errorMessage);
    } else {
      res.status(500).send(error ?? 'Internal Server Error');
    }
  }
});

userRouter.post('/login', async (req: CustomRequest<UserLoginDTO>, res) => {
  try {
    const response = await userModel.logIn(req.body);
    res.status(200).send(response);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.errorMessage);
    } else {
      res.status(500).send(error ?? 'Internal Server Error');
    }
  }
});

userRouter.post('/update', async (req, res) => {
  try {
    const response = await userModel.update(
      req.body,
      req.headers.authorization
    );
    res.status(200).send(response);
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.errorCode).send(error.errorMessage);
    } else {
      res.status(500).send(error ?? 'Internal Server Error');
    }
  }
});

export default userRouter;
