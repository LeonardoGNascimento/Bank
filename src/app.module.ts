import { Module } from '@nestjs/common';
import { AppController } from './application/controller/app.controller';
import { AppService } from './application/service/app.service';
import { BankRepository } from './repository/bank.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BankRepository],
})
export class AppModule {}
