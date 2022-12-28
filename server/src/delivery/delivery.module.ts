import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { SlugService } from 'src/slug/slug.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery])],
  providers: [DeliveryService, SlugService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
