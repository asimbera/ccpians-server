import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../schemas/User';

@Entity()
export default class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({
    default: 'user',
  })
  scope: string;

  @CreateDateColumn()
  readonly createdAt: Date;
}
