import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './Product';

@ObjectType()
@Entity()
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => String)
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  link: string;

  @OneToMany(() => Product, product => product.store)
  products: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedaAt: Date;
}
