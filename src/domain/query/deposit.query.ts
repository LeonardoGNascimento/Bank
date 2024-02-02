interface IDestination {
  id: string;
  balance: number;
}

export interface DepositQuery {
  destination: IDestination;
}
