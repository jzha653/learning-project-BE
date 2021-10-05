export interface EditTransactionDTO {
  description: string;
  timestamp: number;
  value: number;
  type: 'expense' | 'income';
}

export interface TransactionDTO extends EditTransactionDTO {
  transactionId: string;
}

export interface TransactionListDTO {
  items: TransactionDTO[];
}
