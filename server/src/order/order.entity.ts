import { BaseEntity } from '../base-entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Delivery } from 'src/delivery/delivery.entity';
import { Payment } from 'src/payment/payment.entity';
import { OrderProduct } from './order-product.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false }) surname: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) fathername: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) email: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) telegram: string;

  @ManyToOne(() => Delivery) delivery: Delivery;

  @Column({ type: 'varchar', length: 100, nullable: false }) city: string;

  @Column({ type: 'varchar', length: 100, nullable: false }) address: string;

  @ManyToOne(() => Payment) payment: Payment;

  @Column({ type: 'varchar', nullable: true, length: 65535 }) comment: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: 'created' }) status: string;

  @OneToMany(() => OrderProduct, (product) => product.order, {
    cascade: true,
  })
  products: OrderProduct[];
}
