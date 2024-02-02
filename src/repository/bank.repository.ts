import { Account } from 'src/domain/Account';
import { CreateAccountCommand } from 'src/domain/command/createAccount.command';

export class BankRepository {
  accounts: Account[] = [
    {
      accountId: '1',
      balance: 20,
    },
    {
      accountId: '300',
      balance: 0,
    },
  ];

  createAccount({ amount, destination }: CreateAccountCommand) {
    const account = {
      accountId: destination,
      balance: amount,
    };

    this.accounts.push(account);

    return account;
  }

  findAccount(id: string): Account | null {
    const account = this.accounts.find((item) => item.accountId === id);

    if (!account) {
      return null;
    }

    return account;
  }

  updateAccount(account: Account) {
    const index = this.accounts.findIndex(
      (item) => item.accountId == account.accountId,
    );

    this.accounts[index] = account;
  }

  reset() {
    this.accounts = [
      {
        accountId: '1',
        balance: 20,
      },
      {
        accountId: '300',
        balance: 0,
      },
    ];
  }
}
