interface IDestination {
  id: string;
  balance: number;
}

export class DepositQuery {
  destination: IDestination;
}
