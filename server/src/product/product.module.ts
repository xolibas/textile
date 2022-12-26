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

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Category]),
    ConfigModule,
  ],
  providers: [ProductService, CategoryService, FileService],
  controllers: [ProductController],
})
export class ProductModule {}
