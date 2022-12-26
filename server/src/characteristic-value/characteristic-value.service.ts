import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CharacteristicService } from 'src/characteristic/characteristic.service';
import { Not } from 'typeorm';
import { CharacteristicValue } from './characteristic-value.entity';
import { CharacteristicValueDto } from './dto/characteristic-value.dto';
import { GetCharacteristicValuesDto } from './dto/get-characteristic-values.dto';

import slugify = require('slug');

@Injectable()
export class CharacteristicValueService extends TypeOrmCrudService<CharacteristicValue> {
  characteristicService: CharacteristicService;
  constructor(
    @InjectRepository(CharacteristicValue) repo,
    characteristicService: CharacteristicService
  ) {
    super(repo);
    this.characteristicService = characteristicService;
  }

  async getAll(dto: GetCharacteristicValuesDto): Promise<Pagination<CharacteristicValue>> {
    const queryBuilder = this.repo.createQueryBuilder('c');

    if (dto.categoryId) {
      const characteristic = await this.characteristicService.findById(dto.categoryId);
      queryBuilder
        .where({ characteristic: characteristic })
        .leftJoin('c.characteristic', 'characteristic');
    }

    return paginate<CharacteristicValue>(queryBuilder, {
      limit: dto.limit,
      page: dto.page,
    });
  }

  async get(id: number) {
    return await this.findById(id);
  }

  async create(dto: CharacteristicValueDto) {
    const { name, characteristicId } = dto;

    const characteristicValue = new CharacteristicValue();

    const characteristic = await this.characteristicService.findById(characteristicId);

    characteristicValue.name = name;
    await this.generateSlug(name).then((slug) => (characteristicValue.slug = slug));
    characteristicValue.characteristic = characteristic;

    await this.repo.save(characteristicValue);

    return characteristicValue;
  }

  async edit(id: number, dto: CharacteristicValueDto) {
    const { name, characteristicId } = dto;

    const characteristicValue = await this.findById(id);

    const characteristic = await this.characteristicService.findById(characteristicId);

    characteristicValue.name = name;
    await this.generateSlug(name, id).then((slug) => (characteristicValue.slug = slug));
    characteristicValue.characteristic = characteristic;

    await this.repo.save(characteristicValue);

    return characteristicValue;
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

  async findById(id: number): Promise<CharacteristicValue> {
    const characteristicValue = await this.repo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.characteristic', 'characteristic')
      .leftJoinAndSelect('v.products', 'products')
      .where({ id: id })
      .getOne();

    if (!characteristicValue) {
      throw new NotFoundException('Characteristic value with this id not found');
    }

    return characteristicValue;
  }
}
