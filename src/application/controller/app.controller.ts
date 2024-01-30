import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from '../service/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/balance')
  balance(@Param('account_id') account_id: number): number {
    return this.appService.balance(account_id);
  }

  // @Post()
  // event(): string {
  //   return this.appService.getHello();
  // }
}
