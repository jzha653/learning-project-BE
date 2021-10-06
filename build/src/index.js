"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./User/router"));
const router_2 = __importDefault(require("./Transaction/router"));
const app = (0, express_1.default)();
app.use('/user', router_1.default);
app.use('/transaction', router_2.default);
module.exports = { app };
//# sourceMappingURL=index.js.map