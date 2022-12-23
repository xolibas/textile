import { Exclude } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ nullable: true })
  @Exclude()
  createdAt?: Date;

  @CreateDateColumn({ nullable: true })
  @Exclude()
  updatedAt?: Date;
}
