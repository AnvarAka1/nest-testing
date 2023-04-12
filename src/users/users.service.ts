import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto, UserUpdateDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  list(): Promise<UserEntity[]> {
    return this.userRepository.createQueryBuilder('user').getMany();
  }

  detail(userId: number): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOneOrFail();
  }

  async create(user: UserCreateDto) {
    const userEntity = new UserEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;

    return await this.userRepository.save(userEntity);
  }

  async update(userId: number, user: UserUpdateDto) {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOneOrFail();

    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;

    return await this.userRepository.save(userEntity);
  }

  async remove(userId: number): Promise<void> {
    await this.userRepository
      .createQueryBuilder('user')
      .update()
      .set({
        isDeleted: true,
      })
      .where('user.id = :userId', { userId });
  }
}
