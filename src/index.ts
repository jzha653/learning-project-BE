import express = require('express');
const app = express();
const userRouter = require('./User/UserRouter');
app.use('/user', userRouter);

module.exports = {app};
