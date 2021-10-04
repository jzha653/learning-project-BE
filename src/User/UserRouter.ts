const express = require('express');
const router = express.Router();
const userModel = require('./UserModel');

router.post('/signup', async (req: any, res: any) => {
  const response = await userModel.signUp('user1', '123');
  res.status(200).send({
    result: response,
  });
});

router.post('/login', async (req: any, res: any) => {
  const response = await userModel.logIn(req.body.username, req.body.password);
  res.status(200).send({
    result: response,
  });
});

router.post('/update', async (req: any, res: any) => {
  const response = await userModel.update('user3');
  res.status(200).send({
    result: response,
  });
});

module.exports = router;
