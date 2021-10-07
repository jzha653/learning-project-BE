export declare class APIError extends Error {
    errorCode: number;
    constructor(errorCode: number | undefined, errorMessage: string);
}
