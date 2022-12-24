import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConfigTelegram } from 'src/config/telegram.config';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { Telegram } from './telegram.interface';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: Telegram;

  constructor(configService: ConfigService) {
    this.options = getConfigTelegram(configService);
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(
    message: string,
    options?: ExtraReplyMessage,
    chatId: string = this.options.chatId
  ) {
    await this.bot.telegram.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      ...options,
    });
  }

  async sendPhoto(photo: string, message?: string, chatId: string = this.options.chatId) {
    await this.bot.telegram.sendPhoto(
      chatId,
      photo,
      message
        ? {
            caption: message,
          }
        : {}
    );
  }
}
