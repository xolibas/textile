import { BaseEntity } from '../base-entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Category } from 'src/category/category.entity';
import { Image } from './image.entity';
import { CharacteristicValue } from 'src/characteristic-value/characteristic-value.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) slug: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true }) code: string;

  @Column({ type: 'varchar', length: 65535, nullable: true }) description: string;

  @Column({ type: 'float', nullable: false, default: 0 }) wholesalePrice: number;

  @Column({ type: 'int', nullable: true }) size: number;

  @Column({ type: 'int', nullable: false, default: 0 }) quantity: number;

  @Column({ type: 'varchar', length: 100, nullable: true }) sizeValue: string;

  @Column({ type: 'float', nullable: false, default: 0 }) retailPrice: number;

  @ManyToOne(() => Category, (category) => category.products) category: Category;

  @OneToMany(() => Image, (image) => image.product) images: Image[];

  @Column({ type: 'boolean', nullable: false, default: true }) isActive: boolean;

  @ManyToMany(() => CharacteristicValue, (characteristicValue) => characteristicValue.products)
  @JoinTable({ name: 'characteristics_values_products' })
  characteristicValues: CharacteristicValue[];
}
