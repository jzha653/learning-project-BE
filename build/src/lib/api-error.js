"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = void 0;
class APIError extends Error {
    constructor(errorCode = 500, errorMessage) {
        super(errorMessage);
        this.errorCode = errorCode;
    }
}
exports.APIError = APIError;
//# sourceMappingURL=api-error.js.map