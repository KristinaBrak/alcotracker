import { Field, Float, ObjectType } from 'type-graphql';
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

@ObjectType()
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

  @Field(type => Float)
  @Column('float')
  value: number;

  @Field(type => String)
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
