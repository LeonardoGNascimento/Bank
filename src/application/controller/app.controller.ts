import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../service/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/balance')
  balance(@Query('account_id') account_id: string, @Res() response: Response) {
    try {
      const result = this.appService.getBalance(account_id);
      response.json(result);
    } catch (e) {
      response.status(HttpStatus.NOT_FOUND).json(0);
    }
  }

  // @Post()
  // event(): string {
  //   return this.appService.getHello();
  // }
}
