import { BaseEntity } from '../base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from 'src/product/product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) slug: string;

  @Column({ type: 'varchar', length: 65535, nullable: false }) description: string;

  @Column({ type: 'varchar', length: 500 }) fileUrl: string;

  @Column({ type: 'boolean', nullable: false, default: true }) isActive: boolean;

  @OneToMany(() => Product, (product) => product.category) products: Product[];

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({
    name: 'parentId',
    referencedColumnName: 'id',
  })
  parent: Category | null;
}
