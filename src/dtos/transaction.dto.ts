export class TransactionDTO {
  signatures: string[];
  message: {
    account_keys: string[];
    recent_blockhash: string;
    instructions: {
      program_id_index: number;
      accounts: number[];
      data: number[];
    }[];
  };
}
