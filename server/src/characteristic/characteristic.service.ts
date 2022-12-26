import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Not } from 'typeorm';

import { Characteristic } from './characteristic.entity';
import { CharacteristicDto } from './dto/characteristic.dto';
import slugify = require('slug');

@Injectable()
export class CharacteristicService extends TypeOrmCrudService<Characteristic> {
  constructor(@InjectRepository(Characteristic) repo) {
    super(repo);
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
    const characteristic = await this.repo.findOneBy({ id: id });

    if (!characteristic) {
      throw new NotFoundException('Characteristic with this id not found');
    }

    return characteristic;
  }
}
