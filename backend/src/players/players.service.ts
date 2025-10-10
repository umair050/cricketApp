import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: any): Promise<Player> {
    const player = this.playersRepository.create(createPlayerDto);
    const savedPlayer = await this.playersRepository.save(player);
    return Array.isArray(savedPlayer) ? savedPlayer[0] : savedPlayer;
  }

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Player> {
    return this.playersRepository.findOne({
      where: { id },
      relations: ['user', 'teams'],
    });
  }

  async update(id: number, updatePlayerDto: any): Promise<Player> {
    await this.playersRepository.update(id, updatePlayerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.playersRepository.delete(id);
  }

  async findByLocation(city?: string, state?: string, country?: string): Promise<Player[]> {
    const query = this.playersRepository.createQueryBuilder('player')
      .leftJoinAndSelect('player.user', 'user');

    if (city) {
      query.andWhere('player.city = :city', { city });
    }
    if (state) {
      query.andWhere('player.state = :state', { state });
    }
    if (country) {
      query.andWhere('player.country = :country', { country });
    }

    return query.getMany();
  }
}