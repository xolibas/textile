import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Product } from './product.entity';
import { Image } from './image.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoryService } from 'src/category/category.service';
import { Not, Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { FileService } from 'src/file/file.service';
import { ImageDto } from './dto/image.dto';
import { CharacteristicValueService } from 'src/characteristic-value/characteristic-value.service';
import { SlugService } from 'src/slug/slug.service';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  private imageRepository: Repository<Image>;

  constructor(
    @InjectRepository(Product) repo,
    private categoryService: CategoryService,
    @InjectRepository(Image) imageRepository,
    private fileService: FileService,
    private characteristicValueService: CharacteristicValueService,
    private slugService: SlugService
  ) {
    super(repo);
    this.imageRepository = imageRepository;
  }

  async getAll(dto: GetProductsDto, isForAdmin = false): Promise<Pagination<Product>> {
    const category = await this.categoryService.getBySlug(dto.categorySlug);

    const queryBuilder = this.repo.createQueryBuilder('p');
    queryBuilder.orderBy(
      `p.${dto.orderBy}`,
      dto.orderType !== 'ASC' && dto.orderType !== 'DESC' ? 'ASC' : dto.orderType
    );
    if (!isForAdmin) {
      queryBuilder.leftJoinAndSelect('p.images', 'images').where({ isActive: true });
    }

    if (dto.categorySlug) {
      queryBuilder.andWhere({ category: category }).leftJoin('p.category', 'category');
    }

    return paginate<Product>(queryBuilder, {
      limit: dto.limit,
      page: dto.page,
    });
  }

  async get(id: number) {
    const product = await this.findById(id);

    return product;
  }

  async getBySlug(slug: string) {
    const product = await this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'images')
      .where({ slug: slug, isActive: true })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product with this slug not found');
    }

    if (product.size) {
      product['sizes'] = await this.repo
        .createQueryBuilder('p')
        .where({ size: product.size, isActive: true })
        .getMany();
    }

    return product;
  }

  async create(dto: ProductDto) {
    const {
      name,
      description,
      categoryId,
      code,
      wholesalePrice,
      retailPrice,
      size,
      sizeValue,
      quantity,
    } = dto;

    const oldProduct = await this.repo.findOneBy({ code: code });

    if (oldProduct) {
      throw new BadRequestException('Product with this code is already exists');
    }

    const category = await this.categoryService.findById(categoryId);

    const product = new Product();
    await this.slugService.generateSlug(name, this.repo).then((slug) => (product.slug = slug));

    if (size && sizeValue) {
      product.size = size;
      product.sizeValue = sizeValue;
    }

    product.name = name;
    product.description = description;
    product.category = category;
    product.code = code;
    product.wholesalePrice = wholesalePrice;
    product.retailPrice = retailPrice;
    product.quantity = quantity ? quantity : 0;

    await this.repo.save(product);

    return product;
  }

  async edit(id: number, dto: ProductDto) {
    const {
      name,
      description,
      categoryId,
      code,
      wholesalePrice,
      retailPrice,
      size,
      sizeValue,
      quantity,
    } = dto;

    const oldProduct = await this.repo.findOneBy({ code: code, id: Not(id) });

    if (oldProduct) {
      throw new BadRequestException('Product with this code is already exists');
    }

    const product = await this.findById(id);

    const category = await this.categoryService.findById(categoryId);

    if (size && sizeValue) {
      product.size = size;
      product.sizeValue = sizeValue;
    }

    product.name = name;
    await this.slugService.generateSlug(name, this.repo, id).then((slug) => (product.slug = slug));
    product.description = description;
    product.category = category;
    product.quantity = quantity ? quantity : 0;
    product.code = code;
    product.wholesalePrice = wholesalePrice;
    product.retailPrice = retailPrice;

    await this.repo.save(product);

    return product;
  }

  async addImage(id: number, file: Express.Multer.File, dto: ImageDto) {
    const product = await this.findById(id);

    const image = new Image();

    await this.fileService.saveFiles([file], 'products').then((data) => {
      image.alt = dto.alt;
      image.fileUrl = data[0].url;
      image.product = product;
    });

    await this.imageRepository.save(image);

    return await this.findById(id);
  }

  async deleteImage(id: number) {
    const image = await this.imageRepository.findOneBy({ id: id });

    if (!image) {
      throw new NotFoundException('Image with this id not found');
    }

    await this.fileService.deleteFile(image.fileUrl);
    return await this.imageRepository.delete({ id: id });
  }

  async addCharacteristicValue(id: number, characteristicValueId: number) {
    const product = await this.findById(id);

    const characteristicValue = await this.characteristicValueService.findById(
      characteristicValueId
    );

    product.characteristicValues.map((value) => {
      if (value.characteristic.id === characteristicValue.characteristic.id) {
        throw new BadRequestException(
          'Characteristic value for this characteristic is already exists in this product'
        );
      }
    });

    product.characteristicValues.push(characteristicValue);

    await this.repo.save(product);

    return await this.findById(id);
  }

  async removeCharacteristicValue(id: number, characteristicValueId: number) {
    const product = await this.findById(id);

    const characteristicValueToRemove = await this.characteristicValueService.findById(
      characteristicValueId
    );

    product.characteristicValues = product.characteristicValues.filter((characteristicValue) => {
      return characteristicValue.id !== characteristicValueToRemove.id;
    });

    await this.repo.save(product);

    return await this.findById(id);
  }

  async changeStatus(id: number, dto: ChangeStatusDto) {
    const { isActive } = dto;

    const product = await this.findById(id);

    product.isActive = isActive;

    await this.repo.save(product);

    return product;
  }

  async findById(id: number) {
    const product = await this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'images')
      .leftJoinAndSelect('p.characteristicValues', 'characteristicValues')
      .leftJoinAndSelect('characteristicValues.characteristic', 'characteristic')
      .leftJoinAndSelect('p.category', 'category')
      .where({ id: id })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product with this id not found');
    }

    return product;
  }
}
