import { BaseEntity } from '../base-entity';
import { Column, Entity } from 'typeorm';

@Entity('deliveries')
export class Delivery extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false }) slug: string;

  @Column({ type: 'boolean', nullable: false, default: false }) isActive: boolean;
}
