import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { CategoryService } from 'src/category/category.service';
import { FileService } from 'src/file/file.service';
import { SlugService } from 'src/slug/slug.service';
import { CharacteristicController } from './characteristic.controller';
import { Characteristic } from './characteristic.entity';
import { CharacteristicService } from './characteristic.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Characteristic]),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CharacteristicController],
  providers: [CharacteristicService, CategoryService, FileService, SlugService],
})
export class CharacteristicModule {}
