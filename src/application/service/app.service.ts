import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account } from 'src/domain/Account';
import { EventCommand, eventsTypes } from 'src/domain/command/event.command';
import { BankRepository } from '../../repository/bank.repository';
import { CreateAccountCommand } from 'src/domain/command/createAccount.command';
import { DepositQuery } from 'src/domain/query/deposit.query';

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
      throw new NotFoundException('Account not found');
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
    try {
      const eventStrategy: { [key in eventsTypes] } = {
        deposit: () => this.deposit(eventCommand),
        withdraw: () => this.withdraw(eventCommand),
        transfer: () => this.transfer(eventCommand),
      };

      return eventStrategy[eventCommand.type]();
    } catch (e) {
      throw new BadRequestException('Event not found');
    }
  }

  transfer(command: EventCommand) {
    console.log('transfer');
  }

  withdraw(command: EventCommand) {
    console.log('withdraw');
  }

  deposit({ destination, amount }: EventCommand): DepositQuery {
    try {
      this.findAccount(destination);

      const account = this.bankRepository.deposit({
        amount,
        destination,
      });

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
