import { BaseEntity } from '../base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('images')
export class Image extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) alt: string;

  @Column({ type: 'varchar', length: 500, nullable: false, unique: true }) fileUrl: string;

  @ManyToOne(() => Product, (product) => product.images) product: Product;
}
