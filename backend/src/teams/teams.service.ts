import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: any, userId: number): Promise<Team> {
    const team = this.teamsRepository.create({
      ...createTeamDto,
      captain: { id: createTeamDto.captainId || userId },
      createdBy: { id: userId },
    });
    const savedTeam = await this.teamsRepository.save(team);
    return Array.isArray(savedTeam) ? savedTeam[0] : savedTeam;
  }

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      relations: ['captain', 'createdBy', 'members', 'members.player', 'members.player.user'],
    });
  }

  async findOne(id: number): Promise<Team> {
    return this.teamsRepository.findOne({
      where: { id },
      relations: ['captain', 'createdBy', 'members', 'members.player', 'members.player.user', 'tournaments'],
    });
  }

  async update(id: number, updateTeamDto: any): Promise<Team> {
    await this.teamsRepository.update(id, updateTeamDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.teamsRepository.delete(id);
  }

  async addPlayerToTeam(teamId: number, playerId: number): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['players'],
    });
    
    // Add player logic here
    return team;
  }

  async removePlayerFromTeam(teamId: number, playerId: number): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['players'],
    });
    
    // Remove player logic here
    return team;
  }
}