import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Characteristic } from './characteristic.entity';
import { CharacteristicDto } from './dto/characteristic.dto';
import { CategoryService } from 'src/category/category.service';
import { SlugService } from 'src/slug/slug.service';
import { Cache } from 'cache-manager';

@Injectable()
export class CharacteristicService extends TypeOrmCrudService<Characteristic> {
  constructor(
    @InjectRepository(Characteristic) repo,
    private categoryService: CategoryService,
    private slugService: SlugService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    super(repo);
  }

  async getAll() {
    let characteristics = await this.cacheManager.get('all_characteristics');

    if (characteristics) return characteristics;

    characteristics = await this.repo.find();

    return await this.cacheManager.set('all_characteristics', characteristics, 86400);
  }

  async getAllWithValues(categoryId = null) {
    if (!categoryId) {
      const characteristics = await this.cacheManager.get(`characteristics_with_values`);

      if (characteristics) return characteristics;
    }

    const queryBuilder = this.repo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.values', 'value')
      .where({ isFilter: true });

    if (categoryId) {
      queryBuilder
        .leftJoin('c.categories', 'category', 'category.id = :categoryId', {
          categoryId,
        })
        .leftJoinAndSelect('value.products', 'product', 'product.category.id = :categoryId', {
          categoryId,
        })
        .leftJoin('product.category', 'productCategory');
    } else {
      queryBuilder.leftJoinAndSelect('value.products', 'product');
    }

    queryBuilder.loadRelationCountAndMap('value.productsCount', 'value.products');

    const characteristics = await queryBuilder.getMany();

    if (!categoryId) {
      await this.cacheManager.set(`characteristics_with_values`, characteristics, 86400);
    }

    return characteristics;
  }

  async get(id: number) {
    const characteristic = await this.findById(id);

    return characteristic;
  }

  async create(dto: CharacteristicDto) {
    const { name } = dto;

    const characteristic = new Characteristic();

    characteristic.name = name;
    await this.slugService
      .generateSlug(name, this.repo)
      .then((slug) => (characteristic.slug = slug));

    await this.repo.save(characteristic);

    await this.cacheManager.del('all_categories');
    await this.cacheManager.del('characteristics_with_values');

    return characteristic;
  }

  async edit(id: number, dto: CharacteristicDto) {
    const { name } = dto;

    const characteristic = await this.findById(id);

    characteristic.name = name;
    await this.slugService
      .generateSlug(name, this.repo, id)
      .then((slug) => (characteristic.slug = slug));

    await this.repo.save(characteristic);

    await this.cacheManager.del('all_categories');
    await this.cacheManager.del('characteristics_with_values');

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
    await this.cacheManager.del('all_categories');
    await this.cacheManager.del('characteristics_with_values');

    return await this.repo.delete({ id: id });
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
