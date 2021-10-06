import { EditTransactionDTO, TransactionListDTO } from './type';
declare function getAllTransactions(authToken?: string): Promise<TransactionListDTO>;
declare function createTransaction(transaction: EditTransactionDTO, authToken?: string): Promise<TransactionListDTO>;
declare function getTransactionById(transactionId: string, authToken?: string): Promise<FirebaseFirestore.DocumentData | undefined>;
declare function updateTransaction(transaction: EditTransactionDTO, authToken?: string, transactionId?: string): Promise<TransactionListDTO>;
declare function deleteTransaction(transactionId: string, authToken?: string): Promise<TransactionListDTO>;
declare const transactionModel: {
    getAllTransactions: typeof getAllTransactions;
    createTransaction: typeof createTransaction;
    getTransactionById: typeof getTransactionById;
    updateTransaction: typeof updateTransaction;
    deleteTransaction: typeof deleteTransaction;
};
export default transactionModel;
