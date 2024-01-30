import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from 'src/domain/Account';
import { BankRepository } from 'src/repository/bank.repository';

@Injectable()
export class AppService {
  constructor(private bankRepository: BankRepository) {}
  balance(id: number): number {
    try {
      const { balance } = this.findAccount(id);
      return balance;
    } catch (error) {
      return 0;
    }
  }

  findAccount(id: number): Account {
    const account = this.bankRepository.findAccount(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  event() {}
}
