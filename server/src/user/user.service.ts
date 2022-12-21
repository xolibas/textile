import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { ChangeStatusDto } from './dto/changeStatus.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EditUserDto } from './dto/editUser.dto';

import { User } from './user.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }

  async getUsers() {
    return this.repo
      .createQueryBuilder('u')
      .select(['u.name', 'u.email', 'u.role', 'u.isActive'])
      .getMany();
  }

  async getUser(id: number) {
    const user = await this.findById(id);

    return user;
  }

  async createUser(dto: CreateUserDto) {
    let oldUser = await this.repo.findOneBy({ email: dto.email });

    if (oldUser) {
      throw new BadRequestException('User with this email is already exists');
    }

    oldUser = await this.repo.findOneBy({ name: dto.name });

    if (oldUser) {
      throw new BadRequestException('User with this name is already exists');
    }

    const salt = await genSalt(10);

    const { name, email, password, role } = dto;
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = await hash(password, salt);
    user.role = role;

    await this.repo.save(user);

    return user;
  }

  async editUser(id: number, dto: EditUserDto) {
    const { name, email, password, role } = dto;

    const user = await this.findById(id);

    if (user.role === 'owner') {
      throw new BadRequestException('You can not update owner data');
    }

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      const salt = await genSalt(10);
      user.password = await hash(password, salt);
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await this.repo.save(user);

    return user;
  }

  async changeStatus(id: number, dto: ChangeStatusDto) {
    const { isActive } = dto;

    const user = await this.findById(id);

    if (user.role === 'owner') {
      throw new BadRequestException('You can not update owner data');
    }

    user.isActive = isActive;

    await this.repo.save(user);

    return user;
  }

  async findById(id: number) {
    const user = await this.repo.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException('User with this id not found');
    }

    return user;
  }
}
