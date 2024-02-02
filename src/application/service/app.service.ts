import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account } from 'src/domain/Account';
import { CreateAccountCommand } from 'src/domain/command/createAccount.command';
import { EventCommand, eventsTypes } from 'src/domain/command/event.command';
import { DepositQuery } from 'src/domain/query/deposit.query';
import { BankRepository } from '../../repository/bank.repository';
import { TransferQuery } from 'src/domain/query/transfer.query';

@Injectable()
export class AppService {
  constructor(private bankRepository: BankRepository) {}

  getBalance(account_id: string): number {
    try {
      const { balance } = this.findAccount(account_id);
      return balance;
    } catch (e) {
      throw new NotFoundException('Balance not found');
    }
  }

  findAccount(id: string): Account {
    const account = this.bankRepository.findAccount(id);

    if (!account) {
      throw new NotFoundException(`Account not found`);
    }

    return account;
  }

  createAccount(createAccountCommand: CreateAccountCommand) {
    return this.bankRepository.createAccount(createAccountCommand);
  }

  reset() {
    this.bankRepository.reset();
  }

  eventHandler(eventCommand: EventCommand) {
    if (!['deposit', 'withdraw', 'transfer'].includes(eventCommand.type)) {
      throw new BadRequestException('Event type invalid');
    }

    if (eventCommand.amount < 1) {
      throw new BadRequestException('Amount invalid');
    }

    const eventStrategy: { [key in eventsTypes] } = {
      deposit: () => this.deposit(eventCommand),
      withdraw: () => this.withdraw(eventCommand),
      transfer: () => this.transfer(eventCommand),
    };

    return eventStrategy[eventCommand.type]();
  }

  updateAccount(account: Account) {
    return this.bankRepository.updateAccount(account);
  }

  transfer({ origin, destination, amount }: EventCommand): TransferQuery {
    const accountOrigin = this.findAccount(origin);
    const accountDestination = this.findAccount(destination);

    accountOrigin.balance -= amount;
    accountDestination.balance += amount;

    this.updateAccount(accountOrigin);
    this.updateAccount(accountDestination);

    return {
      origin: {
        id: accountOrigin.accountId,
        balance: accountOrigin.balance,
      },
      destination: {
        id: accountDestination.accountId,
        balance: accountDestination.balance,
      },
    };
  }

  withdraw({ origin, amount }: EventCommand) {
    const account = this.findAccount(origin);

    account.balance -= amount;

    this.updateAccount(account);

    return {
      origin: {
        id: account.accountId,
        balance: account.balance,
      },
    };
  }

  deposit({ destination, amount }: EventCommand): DepositQuery {
    try {
      const account = this.findAccount(destination);

      account.balance += amount;

      this.updateAccount(account);

      return {
        destination: {
          id: account.accountId,
          balance: account.balance,
        },
      };
    } catch (e) {
      const account = this.createAccount({
        amount,
        destination,
      });

      return {
        destination: { id: account.accountId, balance: account.balance },
      };
    }
  }
}
