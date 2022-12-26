import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Not } from 'typeorm';

import { Characteristic } from './characteristic.entity';
import { CharacteristicDto } from './dto/characteristic.dto';
import slugify = require('slug');
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class CharacteristicService extends TypeOrmCrudService<Characteristic> {
  categoryService: CategoryService;
  constructor(@InjectRepository(Characteristic) repo, categoryService: CategoryService) {
    super(repo);
    this.categoryService = categoryService;
  }

  async getAll() {
    return await this.repo.find();
  }

  async get(id: number) {
    const characteristic = await this.findById(id);

    return characteristic;
  }

  async create(dto: CharacteristicDto) {
    const { name } = dto;

    const characteristic = new Characteristic();

    characteristic.name = name;
    await this.generateSlug(name).then((slug) => (characteristic.slug = slug));

    await this.repo.save(characteristic);

    return characteristic;
  }

  async edit(id: number, dto: CharacteristicDto) {
    const { name } = dto;

    const characteristic = await this.findById(id);

    characteristic.name = name;
    await this.generateSlug(name, id).then((slug) => (characteristic.slug = slug));

    await this.repo.save(characteristic);

    return characteristic;
  }

  async addCategory(id: number, categoryId: number) {
    const characteristic = await this.findById(id);

    const category = await this.categoryService.findById(categoryId);

    characteristic.categories.push(category);

    await this.repo.save(characteristic);

    return await this.findById(id);
  }

  async removeCategory(id: number, categoryId: number) {
    const characteristic = await this.findById(id);

    const categoryToRemove = await this.categoryService.findById(categoryId);

    characteristic.categories = characteristic.categories.filter((category) => {
      return category.id !== categoryToRemove.id;
    });

    await this.repo.save(characteristic);

    return await this.findById(id);
  }

  async delete(id: number) {
    return await this.repo.delete({ id: id });
  }
  async generateSlug(name: string, id?: number): Promise<string> {
    let oldcharacteristic,
      slugNumber = 0,
      slug;

    do {
      slug = slugify(`${name}${slugNumber ? '-' + slugNumber : ''}`);

      oldcharacteristic = await this.repo.findOneBy(
        id ? { slug: slug, id: Not(id) } : { slug: slug }
      );

      if (oldcharacteristic) slugNumber++;
    } while (oldcharacteristic);

    return slug;
  }

  async findById(id: number): Promise<Characteristic> {
    const characteristic = await this.repo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.categories', 'categories')
      .where({ id: id })
      .getOne();

    if (!characteristic) {
      throw new NotFoundException('Characteristic with this id not found');
    }

    return characteristic;
  }
}
