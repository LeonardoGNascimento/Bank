import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from 'src/domain/Account';
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

  event() {}
}
