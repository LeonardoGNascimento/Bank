import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account } from 'src/domain/Account';
import { EventCommand, eventsTypes } from 'src/domain/command/event.command';
import { BankRepository } from 'src/repository/bank.repository';

@Injectable()
export class AppService {
  constructor(private bankRepository: BankRepository) {}

  getBalance(account_id: string): number {
    const { balance } = this.findAccount(account_id);
    return balance;
  }

  findAccount(id: string): Account {
    const account = this.bankRepository.findAccount(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
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

  deposit(command: EventCommand) {
    console.log('deposity');
  }
}
