import { BaseEntity } from '../base-entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Category } from 'src/category/category.entity';
import { CharacteristicValue } from 'src/characteristic-value/characteristic-value.entity';

@Entity('characteristics')
export class Characteristic extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) slug: string;

  @Column({ type: 'boolean', nullable: false, default: false }) isFilter: boolean;

  @OneToMany(() => CharacteristicValue, (value) => value.characteristic) values: Characteristic[];

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
