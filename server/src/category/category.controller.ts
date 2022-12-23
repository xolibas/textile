import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CategoryService } from './category.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { EditCategoryDto } from './dto/edit-category.dto';

@Controller('category')
export class CategoryController {
  constructor(public service: CategoryService) {}

  @HttpCode(200)
  @Auth()
  @Get()
  async getCategories() {
    return this.service.getAll();
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async getCategory(@Param('id', IdValidationPipe) id: number) {
    return this.service.get(id);
  }

  @HttpCode(200)
  @Get('by-slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.service.getBySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createUser(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async editUser(@Param('id', IdValidationPipe) id, @Body() dto: EditCategoryDto) {
    return this.service.edit(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Patch('/change-status/:id')
  async changeStatus(@Param('id', IdValidationPipe) id, @Body() dto: ChangeStatusDto) {
    return this.service.changeStatus(id, dto);
  }
}
