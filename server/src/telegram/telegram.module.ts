import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';

@Module({
  providers: [TelegramService, ConfigService],
  exports: [TelegramService],
})
export class TelegramModule {}
