import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: RegisterDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'fullName', 'email', 'phone', 'role', 'isActive', 'createdAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'fullName', 'email', 'phone', 'role', 'isActive', 'createdAt'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!query.trim()) {
      return this.findAll();
    }

    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.fullName ILIKE :query OR user.email ILIKE :query', {
        query: `%${query}%`,
      })
      .select(['user.id', 'user.fullName', 'user.email', 'user.phone', 'user.role', 'user.isActive', 'user.createdAt'])
      .limit(20)
      .getMany();
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async debugUsers(): Promise<any> {
    const users = await this.usersRepository.find();
    return {
      count: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }))
    };
  }
}