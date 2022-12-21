import { BaseEntity } from '../base-entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) email: string;

  @Column({ type: 'varchar', nullable: false }) password: string;

  @Column({ type: 'varchar', nullable: false, default: 'admin' }) role: string;

  @Column({ type: 'boolean', nullable: false, default: true }) isActive: boolean;
}
