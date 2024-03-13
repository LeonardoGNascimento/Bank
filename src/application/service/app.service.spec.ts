import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { BankRepository } from '../../repository/bank.repository';
import { TransferQuery } from 'src/domain/query/transfer.query';

describe('AppService', () => {
  let appService: AppService;
  let bankRepository: BankRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService, BankRepository],
    }).compile();

    appService = app.get<AppService>(AppService);
    bankRepository = app.get<BankRepository>(BankRepository);
  });

  describe('findAccount', () => {
    it('must return an account', () => {
      const account = appService.findAccount('1');

      expect(account.accountId).toEqual('1');
      expect(account.balance).toEqual(20);
    });

    it('must throw an exception if account is not found', () => {
      jest.spyOn(bankRepository, 'findAccount').mockReturnValueOnce(null);

      expect(() => appService.findAccount('1')).toThrow('Account not found');
    });
  });

  describe('getBalance', () => {
    it('must return a balance', () => {
      const balance = appService.getBalance('1');

      expect(balance).toEqual(20);
    });

    it('must throw an exception if balance is not found', () => {
      jest.spyOn(bankRepository, 'findAccount').mockReturnValueOnce(null);

      expect(() => appService.getBalance('1')).toThrow('Balance not found');
    });
  });

  describe('reset', () => {
    it('must reset accounts', () => {
      appService.createAccount({
        amount: 1000,
        destination: '1000',
      });

      const account = appService.findAccount('1000');

      expect(account.balance).toEqual(1000);

      appService.reset();

      expect(() => appService.findAccount('1000')).toThrow('Account not found');
    });
  });

  describe('createAccount', () => {
    it('must return an account', () => {
      const account = appService.createAccount({
        amount: 10,
        destination: '10',
      });

      expect(account.accountId).toEqual('10');
      expect(account.balance).toEqual(10);
    });
  });

  describe('eventHandler', () => {
    it('must throw an exception for invalid event type', () => {
      expect(() =>
        appService.eventHandler({
          amount: 10,
          type: 'test',
        } as any),
      ).toThrow('Event type invalid');
    });

    it('must throw an exception for invalid amount', () => {
      expect(() =>
        appService.eventHandler({
          destination: '1',
          amount: -10,
          type: 'deposit',
        }),
      ).toThrow('Amount invalid');
    });

    describe('deposit', () => {
      it('must deposit', () => {
        const result = appService.eventHandler({
          destination: '1',
          amount: 10,
          type: 'deposit',
        });

        expect(result.destination.balance).toEqual(30);
      });

      it('must create a new account if not found', () => {
        const account = appService.eventHandler({
          destination: '10000',
          amount: 10,
          type: 'deposit',
        });

        expect(account.destination.balance).toEqual(10);
      });
    });

    describe('transfer', () => {
      it('must transfer', () => {
        const result: TransferQuery = appService.eventHandler({
          destination: '300',
          amount: 10,
          origin: '1',
          type: 'transfer',
        });

        expect(result.destination.balance).toEqual(10);
        expect(result.origin.balance).toEqual(10);
      });

      it('If you exceed the maximum limit, you must throw an exception', () => {
        try {
          appService.eventHandler({
            destination: '300',
            amount: 300,
            origin: '1',
            type: 'transfer',
          });
        } catch (e) {
          expect(e.message).toEqual('Limit unavailable');
        }
      });

      it('If you not exceed the maximum limit', () => {
        const result = appService.eventHandler({
          destination: '300',
          amount: 220,
          origin: '1',
          type: 'transfer',
        });

        expect(result.origin.balance).toEqual(-200);
      });
    });

    describe('withdraw', () => {
      it('must withdraw', () => {
        const account = appService.eventHandler({
          origin: '1',
          amount: 10,
          type: 'withdraw',
        });

        expect(account.origin.balance).toEqual(10);
      });
    });
  });
});
