import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicController } from './characteristic.controller';
import { Characteristic } from './characteristic.entity';
import { CharacteristicService } from './characteristic.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Characteristic])],
  controllers: [CharacteristicController],
  providers: [CharacteristicService],
})
export class CharacteristicModule {}
