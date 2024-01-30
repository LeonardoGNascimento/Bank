import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { log } from 'console';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('Deve retornar Hello World', () => {
      const resultado = appService.getHello();

      expect(resultado).toEqual('Hello World!');
    });
  });
});
