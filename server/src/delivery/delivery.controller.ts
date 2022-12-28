import {
  Body,
  Controller,
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
import { DeliveryService } from './delivery.service';
import { DeliveryDto } from './dto/delivery.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(public service: DeliveryService) {}

  @HttpCode(200)
  @Get()
  async getAll() {
    return this.service.getAll();
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
  async create(@Body() dto: DeliveryDto) {
    return this.service.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async edit(@Param('id', ParseIntPipe) id, @Body() dto: DeliveryDto) {
    return this.service.edit(id, dto);
  }
}
