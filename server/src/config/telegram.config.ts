import { ConfigService } from '@nestjs/config';
import { Telegram } from 'src/telegram/telegram.interface';

export const getConfigTelegram = (configService: ConfigService): Telegram => ({
  chatId: configService.get('TELEGRAM_CHAT_ID'),
  token: configService.get('TELEGRAM_TOKEN'),
});
