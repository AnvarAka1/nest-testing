import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user';
import { Repository } from 'typeorm';
import { UserCreateDto, UserUpdateDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  list(): Promise<User[]> {
    return this.userRepository.createQueryBuilder('user').getMany();
  }

  detail(userId: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOneOrFail();
  }

  async create(user: UserCreateDto) {
    const userEntity = new User();
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
