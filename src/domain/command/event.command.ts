export type eventsTypes = 'deposit' | 'withdraw' | 'transfer';

export class EventCommand {
  type: eventsTypes;
  origin?: string;
  destination?: string;
  amount: number;
}
