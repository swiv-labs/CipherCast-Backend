"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, message, data, statusCode = 200) => {
    const response = {
        status: 'success',
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.successResponse = successResponse;
const errorResponse = (res, message, error, statusCode = 400) => {
    const response = {
        status: 'error',
        message,
        error: error?.message || error,
    };
    return res.status(statusCode).json(response);
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=response.js.map