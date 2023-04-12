import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  isDefault: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.images)
  product: ProductEntity;

  @CreateDateColumn()
  createdAt: Date;
}
