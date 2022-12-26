import { BaseEntity } from '../base-entity';
import { Column, Entity } from 'typeorm';

@Entity('characteristics')
export class Characteristic extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) slug: string;
}
