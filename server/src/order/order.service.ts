import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/delivery/delivery.entity';
import { Payment } from 'src/payment/payment.entity';
import { Product } from 'src/product/product.entity';
import { TelegramService } from 'src/telegram/telegram.service';
import { Repository } from 'typeorm';
import { ChangeStatusDto } from './dto/change-status.dto';
import { OrderDto } from './dto/order.dto';
import { OrderProduct } from './order-product.entity';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  private repo: Repository<Order>;
  private orderProductRepository: Repository<OrderProduct>;
  private deliveryRepository: Repository<Delivery>;
  private paymentRepository: Repository<Payment>;
  private productRepository: Repository<Product>;
  constructor(
    @InjectRepository(Order) repo,
    @InjectRepository(OrderProduct) orderProductRepository,
    @InjectRepository(Delivery) deliveryRepository,
    @InjectRepository(Payment) paymentRepository,
    @InjectRepository(Product) productRepository,
    private configService: ConfigService,
    private telegramService: TelegramService
  ) {
    this.repo = repo;
    this.orderProductRepository = orderProductRepository;
    this.deliveryRepository = deliveryRepository;
    this.paymentRepository = paymentRepository;
    this.productRepository = productRepository;
  }

  async getAll() {
    return this.repo.find();
  }

  async get(id: number) {
    const order = this.repo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.products', 'orderProduct')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .where({ id: id })
      .getOne();

    if (!order) {
      throw new NotFoundException('Order with this id was not found');
    }

    return order;
  }

  async create(dto: OrderDto) {
    const {
      name,
      surname,
      fathername,
      email,
      phone,
      telegram,
      paymentSlug,
      deliverySlug,
      city,
      address,
      comment,
      products,
    } = dto;

    const delivery = await this.deliveryRepository.findOneBy({ slug: deliverySlug });

    if (!delivery) {
      throw new NotFoundException('Delivery with this slug was not found');
    }

    const payment = await this.paymentRepository.findOneBy({ slug: paymentSlug });

    if (!payment) {
      throw new NotFoundException('Payment with this slug was not found');
    }

    const order = new Order();

    order.name = name;
    order.surname = surname;
    order.fathername = fathername;

    if (!email && !phone) {
      throw new BadRequestException('Email or phone must be added to the order');
    }

    order.email = email;
    order.phone = phone;
    order.telegram = telegram;
    order.city = city;
    order.address = address;
    order.comment = comment;
    order.delivery = delivery;
    order.payment = payment;
    order.status = 'created';

    const orderProducts = [];

    await Promise.all(
      products.map(async (value) => {
        const product = await this.productRepository.findOneBy({ id: value.productId });

        if (!product) {
          throw new NotFoundException('Product with this id was not found');
        }

        if (product.quantity < value.quantity) {
          throw new BadRequestException(`Products quantity must be less than ${product.quantity}`);
        }

        const orderProductCount = await this.orderProductRepository
          .createQueryBuilder('op')
          .leftJoin('op.order', 'order')
          .leftJoin('op.product', 'product')
          .where({ order: order, product: product })
          .getCount();

        if (orderProductCount) return;

        const orderProduct = new OrderProduct();

        orderProduct.product = product;
        orderProduct.order = order;
        orderProduct.quantity = value.quantity;

        orderProducts.push(orderProduct);
      })
    );

    let msg = `<b>Нове замовлення!</b>\n\n<strong>Товари:</strong>`;

    let summ = 0;

    await Promise.all(
      orderProducts.map(async (value) => {
        const product = await this.productRepository.findOneBy({ id: value.product.id });

        const price = value.quantity * product.retailPrice;

        msg = msg + `\n\t${product.name} - ${value.quantity} шт. - ${price.toFixed(2)} грн;`;

        summ += price;

        product.quantity -= value.quantity;

        await this.productRepository.save(product);
      })
    );

    msg = msg + `\nСума замовлення: ${summ.toFixed(2)} грн.`;

    await this.repo.save(order);

    await this.orderProductRepository.save(orderProducts);

    await this.telegramService.sendMessage(msg, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: this.configService.get('ADMIN_ORDER_URL') + order.id,
              text: 'Переглянути замовлення',
            },
          ],
        ],
      },
    });

    return { message: 'Order created' };
  }

  async changeStatus(id: number, dto: ChangeStatusDto) {
    const order = await this.repo.findOneBy({ id: id });

    if (!order) {
      throw new NotFoundException('Order with this id was not found');
    }

    if (order.status === dto.status) {
      return { message: `This order already have status ${order.status}` };
    }
    order.status = dto.status;

    await this.repo.save(order);

    return await this.get(id);
  }
}
