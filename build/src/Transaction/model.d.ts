import { EditTransactionDTO, TransactionDTO, TransactionListDTO } from './type';
declare function getAllTransactions(authToken?: string): Promise<TransactionListDTO>;
declare function createTransaction(transaction: EditTransactionDTO, authToken?: string): Promise<TransactionListDTO>;
declare function getTransactionById(transactionId: string, authToken?: string): Promise<TransactionDTO>;
declare function updateTransaction(transaction: EditTransactionDTO, transactionId: string, authToken?: string): Promise<TransactionListDTO>;
declare function deleteTransaction(transactionId: string, authToken?: string): Promise<TransactionListDTO>;
declare const transactionModel: {
    getAllTransactions: typeof getAllTransactions;
    createTransaction: typeof createTransaction;
    getTransactionById: typeof getTransactionById;
    updateTransaction: typeof updateTransaction;
    deleteTransaction: typeof deleteTransaction;
};
export default transactionModel;
