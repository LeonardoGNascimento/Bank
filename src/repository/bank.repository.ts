import { Account } from 'src/domain/Account';

export class BankRepository {
  accounts: Account[] = [
    {
      accountId: '100',
      balance: 20,
    },
  ];

  findAccount(id: string): Account | null {
    const account = this.accounts.find((item) => item.accountId === id);

    if (!account) {
      return null;
    }

    return account;
  }
}
