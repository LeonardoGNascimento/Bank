import { Account } from 'src/domain/Account';
import { CreateAccountCommand } from 'src/domain/command/createAccount.command';
import { DepositAccountCommand } from 'src/domain/command/deposit.command';

export class BankRepository {
  accounts: Account[] = [
    {
      accountId: '1',
      balance: 20,
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

  deposit({ amount, destination }: DepositAccountCommand) {
    const index = this.accounts.findIndex(
      (item) => item.accountId == destination,
    );

    let account = this.accounts[index];
    account.balance += amount;

    this.accounts[index] = account;

    return account;
  }

  reset() {
    this.accounts = [
      {
        accountId: '1',
        balance: 20,
      },
    ];
  }
}
