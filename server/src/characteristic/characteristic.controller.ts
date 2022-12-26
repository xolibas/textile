import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicDto } from './dto/characteristic.dto';

@Controller('characteristic')
export class CharacteristicController {
  constructor(public service: CharacteristicService) {}

  @HttpCode(200)
  @Get('')
  @Auth()
  async getAll() {
    return this.service.getAll();
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: number) {
    return this.service.get(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: CharacteristicDto) {
    return this.service.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async edit(@Param('id', IdValidationPipe) id, @Body() dto: CharacteristicDto) {
    return this.service.edit(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id) {
    return this.service.delete(id);
  }
}
