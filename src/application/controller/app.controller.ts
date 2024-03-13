import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EventCommand } from 'src/domain/command/event.command';
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

  @HttpCode(HttpStatus.OK)
  @Post('/reset')
  reset() {
    this.appService.reset();

    return 'OK';
  }

  @Post('/event')
  event(@Body() eventCommand: EventCommand, @Res() res: Response) {
    try {
      const response = this.appService.eventHandler(eventCommand);
      res.json(response);
    } catch (e) {
      res.status(e.status).json(0);
    }
  }
}
