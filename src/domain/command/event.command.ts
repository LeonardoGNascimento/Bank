export type eventsTypes = 'deposit' | 'withdraw' | 'transfer';

export interface EventCommand {
  type: eventsTypes;
  origin?: string;
  destination?: string;
  amount: number;
}
