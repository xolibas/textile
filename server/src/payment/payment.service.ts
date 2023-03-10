import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SlugService } from 'src/slug/slug.service';

import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {
  constructor(@InjectRepository(Payment) repo, private slugService: SlugService) {
    super(repo);
  }

  async getAll() {
    return await this.repo.find();
  }

  async get(id: number) {
    const payment = await this.repo.findOneBy({ id: id });

    if (!payment) {
      throw new NotFoundException('Payment with this id was not found');
    }

    return payment;
  }

  async create(dto: PaymentDto) {
    const { name, status } = dto;

    const payment = new Payment();

    payment.name = name;
    payment.isActive = status;
    await this.slugService.generateSlug(name, this.repo).then((slug) => (payment.slug = slug));

    await this.repo.save(payment);

    return payment;
  }

  async edit(id: number, dto: PaymentDto) {
    const { name, status } = dto;

    const payment = await this.repo.findOneBy({ id: id });

    if (!payment) {
      throw new NotFoundException('Payment with this id was not found');
    }

    payment.name = name;
    payment.isActive = status;
    await this.slugService.generateSlug(name, this.repo, id).then((slug) => (payment.slug = slug));

    await this.repo.save(payment);

    return payment;
  }
}
