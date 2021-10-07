"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_error_1 = require("../lib/api-error");
const model_1 = __importDefault(require("./model"));
const userRouter = express_1.default.Router();
userRouter.post('/signup', async (req, res) => {
    var _a;
    try {
        // move to model
        const response = await model_1.default.signUp(req.body);
        res.status(201).send(response);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.message);
        }
        else {
            res.status(500).send((_a = error.message) !== null && _a !== void 0 ? _a : 'Internal Server Error');
        }
    }
});
userRouter.post('/login', async (req, res) => {
    var _a;
    try {
        const response = await model_1.default.logIn(req.body);
        res.status(200).send(response);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.message);
        }
        else {
            res.status(500).send((_a = error.message) !== null && _a !== void 0 ? _a : 'Internal Server Error');
        }
    }
});
userRouter.post('/update', async (req, res) => {
    var _a;
    try {
        const response = await model_1.default.update(req.body, req.headers.authorization);
        res.status(200).send(response);
    }
    catch (error) {
        if (error instanceof api_error_1.APIError) {
            res.status(error.errorCode).send(error.message);
        }
        else {
            res.status(500).send((_a = error.message) !== null && _a !== void 0 ? _a : 'Internal Server Error');
        }
    }
});
exports.default = userRouter;
//# sourceMappingURL=router.js.map