import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';
import { SlugService } from 'src/slug/slug.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, FileService, SlugService],
})
export class CategoryModule {}
