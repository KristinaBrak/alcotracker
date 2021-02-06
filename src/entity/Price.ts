import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Product } from './Product';

@Entity()
export class Price extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Product, product => product.prices, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column('float')
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedaAt: Date;
}
