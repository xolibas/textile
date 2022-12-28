import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SlugService } from 'src/slug/slug.service';

import { Delivery } from './delivery.entity';
import { DeliveryDto } from './dto/delivery.dto';

@Injectable()
export class DeliveryService extends TypeOrmCrudService<Delivery> {
  constructor(@InjectRepository(Delivery) repo, private slugService: SlugService) {
    super(repo);
  }

  async getAll() {
    return await this.repo.find();
  }

  async get(id: number) {
    return await this.repo.findBy({ id: id });
  }

  async create(dto: DeliveryDto) {
    const { name, status } = dto;

    const delivery = new Delivery();

    delivery.name = name;
    delivery.isActive = status;
    await this.slugService.generateSlug(name, this.repo).then((slug) => (delivery.slug = slug));

    await this.repo.save(delivery);

    return delivery;
  }

  async edit(id: number, dto: DeliveryDto) {
    const { name, status } = dto;

    const delivery = await this.repo.findOneBy({ id: id });

    delivery.name = name;
    delivery.isActive = status;
    await this.slugService.generateSlug(name, this.repo, id).then((slug) => (delivery.slug = slug));

    await this.repo.save(delivery);

    return delivery;
  }
}
