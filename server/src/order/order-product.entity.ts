import { BaseEntity } from '../base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { Order } from './order.entity';

@Entity('orders_products')
export class OrderProduct extends BaseEntity {
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.products, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @Column({ type: 'int', nullable: false, default: 1 }) quantity: number;
}
