import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { Category } from './Category';
import { Price } from './Price';
import { Store } from './Store';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('text')
  name: string;

  @OneToMany(() => Price, price => price.product)
  prices: Price[];

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @ManyToOne(() => Store, store => store.products, { cascade: ['remove'] })
  store: Store;

  @Column('float', { nullable: true })
  alcVolume?: number;

  @Column('float', { nullable: true })
  volume?: number;

  @Index()
  @Column('text', { unique: true })
  link: string;

  @Column('text')
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedaAt: Date;
}
