import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { Category } from './Category';
import { Price } from './Price';
import { Store } from './Store';

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => String)
  @Index()
  @Column('text')
  name: string;

  @Field(type => [Price])
  @OneToMany(() => Price, price => price.product)
  prices: Price[];

  @Field(type => Float)
  priceMean: number;

  @Field(type => Float)
  priceMode: number;

  @Field(type => Category)
  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Field(type => Store)
  @ManyToOne(() => Store, store => store.products, { cascade: ['remove'] })
  store: Store;

  @Field(type => Float, { nullable: true })
  @Column('float', { nullable: true })
  alcVolume: number | null;

  @Field(type => Float, { nullable: true })
  @Column('float', { nullable: true })
  volume: number | null;

  @Field(type => String)
  @Index()
  @Column('text', { unique: true })
  link: string;

  @Field(type => String)
  @Column('text')
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedaAt: Date;
}
