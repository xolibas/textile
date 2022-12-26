import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductService } from './product.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { ProductDto } from './dto/product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { ImageDto } from './dto/image.dto';

@Controller('product')
export class ProductController {
  constructor(public service: ProductService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('get-all-for-admin')
  async getAllForAdmin(@Body() dto: GetProductsDto) {
    return this.service.getAll(dto, true);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('get-all')
  async getAll(@Body() dto: GetProductsDto) {
    return this.service.getAll(dto);
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.get(id);
  }

  @HttpCode(200)
  @Get('by-slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.service.getBySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: ProductDto) {
    return this.service.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async edit(@Param('id', ParseIntPipe) id, @Body() dto: ProductDto) {
    return this.service.edit(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Patch('change-status/:id')
  async changeStatus(@Param('id', ParseIntPipe) id, @Body() dto: ChangeStatusDto) {
    return this.service.changeStatus(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Patch('add-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @Param('id', ParseIntPipe) id,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ImageDto
  ) {
    if (!file) {
      throw new BadRequestException('File is not found');
    }

    return this.service.addImage(id, file, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete('delete-image/:id')
  async deleteImage(@Param('id', ParseIntPipe) id) {
    return this.service.deleteImage(id);
  }
}
