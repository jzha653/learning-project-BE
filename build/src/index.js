"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const userRouter = require('./User/UserRouter');
app.use('/user', userRouter);
module.exports = { app };
//# sourceMappingURL=index.js.map