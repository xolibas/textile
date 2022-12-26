import { BaseEntity } from '../base-entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Category } from 'src/category/category.entity';

@Entity('characteristics')
export class Characteristic extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) slug: string;

  @Column({ type: 'boolean', nullable: false, default: false }) isFilter: boolean;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
