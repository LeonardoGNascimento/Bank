interface IAccount {
  id: string;
  balance: number;
}

export interface TransferQuery {
  origin: IAccount;
  destination: IAccount;
}
