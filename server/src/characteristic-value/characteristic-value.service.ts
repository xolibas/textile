import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CharacteristicService } from 'src/characteristic/characteristic.service';
import { CharacteristicValue } from './characteristic-value.entity';
import { CharacteristicValueDto } from './dto/characteristic-value.dto';
import { GetCharacteristicValuesDto } from './dto/get-characteristic-values.dto';

import { SlugService } from 'src/slug/slug.service';

@Injectable()
export class CharacteristicValueService extends TypeOrmCrudService<CharacteristicValue> {
  constructor(
    @InjectRepository(CharacteristicValue) repo,
    private characteristicService: CharacteristicService,
    private slugService: SlugService
  ) {
    super(repo);
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
    await this.slugService
      .generateSlug(name, this.repo)
      .then((slug) => (characteristicValue.slug = slug));
    characteristicValue.characteristic = characteristic;

    await this.repo.save(characteristicValue);

    return characteristicValue;
  }

  async edit(id: number, dto: CharacteristicValueDto) {
    const { name, characteristicId } = dto;

    const characteristicValue = await this.findById(id);

    const characteristic = await this.characteristicService.findById(characteristicId);

    characteristicValue.name = name;
    await this.slugService
      .generateSlug(name, this.repo, id)
      .then((slug) => (characteristicValue.slug = slug));
    characteristicValue.characteristic = characteristic;

    await this.repo.save(characteristicValue);

    return characteristicValue;
  }

  async delete(id: number) {
    return await this.repo.delete({ id: id });
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
