import { BaseEntity } from '../base-entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from 'src/category/category.entity';
import { Image } from './image.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) slug: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true }) code: string;

  @Column({ type: 'varchar', length: 65535, nullable: true }) description: string;

  @Column({ type: 'float', nullable: false, default: 0 }) wholesalePrice: number;

  @Column({ type: 'float', nullable: false, default: 0 }) retailPrice: number;

  @ManyToOne(() => Category, (category) => category.products) category: Category;

  @OneToMany(() => Image, (image) => image.product) images: Image[];

  @Column({ type: 'boolean', nullable: false, default: true }) isActive: boolean;
}
