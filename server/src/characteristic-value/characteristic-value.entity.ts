import { BaseEntity } from '../base-entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Characteristic } from 'src/characteristic/characteristic.entity';
import { Product } from 'src/product/product.entity';

@Entity('characteristics_values')
export class CharacteristicValue extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) slug: string;

  @ManyToOne(() => Characteristic, (characteristic) => characteristic.values, { nullable: false })
  characteristic: Characteristic;

  @ManyToMany(() => Product)
  @JoinTable({ name: 'characteristics_values_products' })
  products: Product[];
}
