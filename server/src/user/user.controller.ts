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
import { Crud, CrudController } from '@nestjsx/crud';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { User } from './decorators/user.decorator';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

import { User as UserModel } from './user.entity';
import { UserService } from './user.service';

@Crud({
  model: {
    type: UserModel,
  },
})
@Controller('user')
export class UserController implements CrudController<UserModel> {
  constructor(public service: UserService) {}

  @HttpCode(200)
  @Auth('owner')
  @Get()
  async getUsers() {
    return this.service.getUsers();
  }

  @HttpCode(200)
  @Get('profile')
  @Auth()
  async getProfile(@User('id') id: number) {
    return this.service.getUser(id);
  }

  @HttpCode(200)
  @Auth('owner')
  @Get(':id')
  async getUser(@Param('id', IdValidationPipe) id: number) {
    return this.service.getUser(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth('owner')
  async createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('owner')
  @Put(':id')
  async editUser(@Param('id', IdValidationPipe) id, @Body() dto: EditUserDto) {
    return this.service.editUser(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('owner')
  @Patch('/change-status/:id')
  async changeStatus(@Param('id', IdValidationPipe) id, @Body() dto: ChangeStatusDto) {
    return this.service.changeStatus(id, dto);
  }
}
