import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Delivery } from 'src/delivery/delivery.entity';
import { OrderProduct } from './order-product.entity';
import { Product } from 'src/product/product.entity';
import { Payment } from 'src/payment/payment.entity';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from 'src/telegram/telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Delivery, OrderProduct, Product, Payment])],
  providers: [OrderService, ConfigService, TelegramService],
  controllers: [OrderController],
})
export class OrderModule {}
