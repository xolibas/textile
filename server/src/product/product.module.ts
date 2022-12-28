import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ConfigModule } from '@nestjs/config';
import { CategoryService } from 'src/category/category.service';
import { Image } from './image.entity';
import { FileService } from 'src/file/file.service';
import { Category } from 'src/category/category.entity';
import { CharacteristicValue } from 'src/characteristic-value/characteristic-value.entity';
import { CharacteristicValueService } from 'src/characteristic-value/characteristic-value.service';
import { CharacteristicService } from 'src/characteristic/characteristic.service';
import { Characteristic } from 'src/characteristic/characteristic.entity';
import { SlugService } from 'src/slug/slug.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([CharacteristicValue]),
    TypeOrmModule.forFeature([Characteristic]),
    ConfigModule,
  ],
  providers: [
    ProductService,
    CategoryService,
    FileService,
    CharacteristicValueService,
    CharacteristicService,
    SlugService,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
