import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FileService } from 'src/file/file.service';
import { IsNull, Not } from 'typeorm';

import { Category } from './category.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { EditCategoryDto } from './dto/edit-category.dto';
import slugify = require('slug');

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(@InjectRepository(Category) repo, private fileService: FileService) {
    super(repo);
  }

  async getAll() {
    return await this.repo.find();
  }

  async getAllWithSubcategories() {
    const categories = await this.repo
      .createQueryBuilder('c')
      .where({ parent: IsNull(), isActive: true })
      .leftJoinAndSelect('c.parent', 'category')
      .getMany();

    const result = [];

    categories.forEach((category) => result.push(this.getCategoryWithSubCategories(category)));

    return Promise.all(result);
  }

  async get(id: number) {
    const category = await this.findById(id);

    return category;
  }

  async getBySlug(slug: string) {
    const category = await this.repo.findOneBy({ slug: slug, isActive: true });

    if (!category) {
      throw new NotFoundException('Category with this slug not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const { name, description, categoryId } = dto;

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
    await this.generateSlug(name).then((slug) => (category.slug = slug));
    category.description = description;
    category.fileUrl = '';

    await this.repo.save(category);

    return category;
  }

  async edit(id: number, dto: EditCategoryDto) {
    const { name, description, categoryId } = dto;

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
    await this.generateSlug(name, id).then((slug) => (category.slug = slug));
    category.description = description;

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

  async addImage(id: number, file: Express.Multer.File) {
    const category = await this.findById(id);

    if (category.fileUrl) {
      await this.fileService.deleteFile(category.fileUrl);
    }

    await this.fileService.saveFiles([file], 'categories').then((data) => {
      category.fileUrl = data[0].url;
    });

    await this.repo.save(category);

    return category;
  }

  async generateSlug(name: string, id?: number): Promise<string> {
    let oldcategory,
      slugNumber = 0,
      slug;

    do {
      slug = slugify(`${name}${slugNumber ? '-' + slugNumber : ''}`);

      oldcategory = await this.repo.findOneBy(id ? { slug: slug, id: Not(id) } : { slug: slug });

      if (oldcategory) slugNumber++;
    } while (oldcategory);

    return slug;
  }

  async findById(id: number): Promise<Category> {
    const category = await this.repo.findOneBy({ id: id });

    if (!category) {
      throw new NotFoundException('Category with this id not found');
    }

    return category;
  }

  async getCategoryWithSubCategories(category: Category) {
    const subCategories = await this.repo
      .createQueryBuilder('c')
      .where({ parent: category, isActive: true })
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
}
