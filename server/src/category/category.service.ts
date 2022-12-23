import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IsNull } from 'typeorm';

import { Category } from './category.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { EditCategoryDto } from './dto/edit-category.dto';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(@InjectRepository(Category) repo) {
    super(repo);
  }

  async getAll() {
    const categories = await this.repo
      .createQueryBuilder('c')
      .where({ parent: IsNull() })
      .leftJoinAndSelect('c.parent', 'category')
      .getMany();

    const result = [];

    categories.forEach((category) => result.push(this.getCategoryWithSubCategories(category)));

    return Promise.all(result);
  }

  async getCategoryWithSubCategories(category: Category) {
    const subCategories = await this.repo
      .createQueryBuilder('c')
      .where({ parent: category })
      .leftJoinAndSelect('c.parent', 'category')
      .getMany();

    if (subCategories.length > 0) {
      const promises = [];
      subCategories.forEach((category) => {
        promises.push(this.getCategoryWithSubCategories(category));
      });
      category['subCategories'] = await Promise.all(promises);
    } else category['subCategories'] = [];
    return category;
  }

  async get(id: number) {
    const category = await this.findById(id);

    return category;
  }

  async getBySlug(slug: string) {
    const category = await this.repo.findOneBy({ slug: slug });

    if (!category) {
      throw new NotFoundException('Category with this slug not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    let oldcategory = await this.repo.findOneBy({ name: dto.name });

    if (oldcategory) {
      throw new BadRequestException('Category with this name is already exists');
    }

    oldcategory = await this.repo.findOneBy({ slug: dto.slug });

    if (oldcategory) {
      throw new BadRequestException('Category with this slug is already exists');
    }

    const { name, slug, description, fileUrl, categoryId } = dto;

    const category = new Category();

    if (categoryId) {
      this.findById(categoryId).then((data) => {
        if (!data) {
          throw new BadRequestException('Category with this id is not found');
        }

        category.parent = data;
      });
    }

    category.name = name;
    category.slug = slug;
    category.description = description;
    category.fileUrl = fileUrl;

    await this.repo.save(category);

    return category;
  }

  async edit(id: number, dto: EditCategoryDto) {
    const { name, slug, description, fileUrl, categoryId } = dto;

    const category = await this.findById(id);

    if (categoryId) {
      this.findById(categoryId).then((data) => {
        if (!data) {
          throw new BadRequestException('Category with this id is not found');
        }

        category.parent = data;
      });
    }

    category.name = name;
    category.slug = slug;
    category.description = description;
    category.fileUrl = fileUrl;

    await this.repo.save(category);

    return category;
  }

  async changeStatus(id: number, dto: ChangeStatusDto) {
    const { isActive } = dto;

    const category = await this.findById(id);

    category.isActive = isActive;

    await this.repo.save(category);

    return category;
  }

  async findById(id: number): Promise<Category> {
    const category = await this.repo.findOneBy({ id: id });

    if (!category) {
      throw new NotFoundException('Category with this id not found');
    }

    return category;
  }
}
