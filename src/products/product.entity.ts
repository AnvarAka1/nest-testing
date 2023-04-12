import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { JoinTable } from 'typeorm/browser';
import { ImageEntity } from '../images/image.entity';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @OneToMany(() => ImageEntity, (image) => image.product)
  images: ImageEntity[];

  @ManyToMany(() => UserEntity, (user) => user.products)
  @JoinTable()
  users: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
