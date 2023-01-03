import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderService } from './order.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(public service: OrderService) {}

  @HttpCode(200)
  @Get('')
  @Auth()
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
  @Post('')
  async create(@Body() dto: OrderDto) {
    return this.service.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Patch('/change-status/:id')
  async changeStatus(@Param('id', ParseIntPipe) id, @Body() dto: ChangeStatusDto) {
    return this.service.changeStatus(id, dto);
  }
}
