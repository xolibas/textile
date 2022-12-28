import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { CategoryService } from 'src/category/category.service';
import { Characteristic } from 'src/characteristic/characteristic.entity';
import { CharacteristicService } from 'src/characteristic/characteristic.service';
import { FileService } from 'src/file/file.service';
import { Image } from 'src/product/image.entity';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { SlugService } from 'src/slug/slug.service';
import { CharacteristicValueController } from './characteristic-value.controller';
import { CharacteristicValue } from './characteristic-value.entity';
import { CharacteristicValueService } from './characteristic-value.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CharacteristicValue]),
    TypeOrmModule.forFeature([Characteristic]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Category]),
    ConfigModule,
  ],
  providers: [
    CharacteristicValueService,
    CharacteristicService,
    ProductService,
    CategoryService,
    FileService,
    SlugService,
  ],
  controllers: [CharacteristicValueController],
})
export class CharacteristicValueModule {}
