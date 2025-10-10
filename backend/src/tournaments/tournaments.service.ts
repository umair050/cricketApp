import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async create(createTournamentDto: any): Promise<Tournament> {
    const tournament = this.tournamentsRepository.create(createTournamentDto);
    const savedTournament = await this.tournamentsRepository.save(tournament);
    return Array.isArray(savedTournament) ? savedTournament[0] : savedTournament;
  }

  async findAll(): Promise<Tournament[]> {
    return this.tournamentsRepository.find({
      relations: ['organizer', 'teams'],
    });
  }

  async findOne(id: number): Promise<Tournament> {
    return this.tournamentsRepository.findOne({
      where: { id },
      relations: ['organizer', 'teams', 'teams.players'],
    });
  }

  async update(id: number, updateTournamentDto: any): Promise<Tournament> {
    await this.tournamentsRepository.update(id, updateTournamentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tournamentsRepository.delete(id);
  }

  async addTeamToTournament(tournamentId: number, teamId: number): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['teams'],
    });
    
    // Add team logic here
    return tournament;
  }

  async removeTeamFromTournament(tournamentId: number, teamId: number): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['teams'],
    });
    
    // Remove team logic here
    return tournament;
  }
}