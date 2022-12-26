import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CharacteristicValueService } from './characteristic-value.service';
import { CharacteristicValueDto } from './dto/characteristic-value.dto';
import { GetCharacteristicValuesDto } from './dto/get-characteristic-values.dto';

@Controller('characteristic-value')
export class CharacteristicValueController {
  constructor(public service: CharacteristicValueService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('get-all')
  async getAll(@Body() dto: GetCharacteristicValuesDto) {
    return this.service.getAll(dto);
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.service.get(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: CharacteristicValueDto) {
    return this.service.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async edit(@Param('id', ParseIntPipe) id, @Body() dto: CharacteristicValueDto) {
    return this.service.edit(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return this.service.delete(id);
  }
}
