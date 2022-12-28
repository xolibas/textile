import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfigORM } from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { FileModule } from './file/file.module';
import { TelegramModule } from './telegram/telegram.module';
import { CharacteristicModule } from './characteristic/characteristic.module';
import { CharacteristicValueModule } from './characteristic-value/characteristic-value.module';
import { SlugModule } from './slug/slug.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getConfigORM,
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    FileModule,
    TelegramModule,
    CharacteristicModule,
    CharacteristicValueModule,
    SlugModule,
    DeliveryModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
