import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Player, PlayerRole, BattingStyle, BowlingStyle } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';
import { Tournament, TournamentFormat, TournamentStatus } from '../tournaments/entities/tournament.entity';
import { UserRole } from '../auth/dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async seedAll() {
    console.log('🌱 Starting database seeding...');
    
    try {
      // Clear existing data
      await this.clearData();
      
      // Seed in order (users first, then players, teams, tournaments)
      const users = await this.seedUsers();
      const players = await this.seedPlayers(users);
      const teams = await this.seedTeams(players);
      const tournaments = await this.seedTournaments(users, teams);
      
      console.log('✅ Database seeding completed successfully!');
      console.log(`📊 Created: ${users.length} users, ${players.length} players, ${teams.length} teams, ${tournaments.length} tournaments`);
      
      return {
        success: true,
        created: {
          users: users.length,
          players: players.length,
          teams: teams.length,
          tournaments: tournaments.length,
        }
      };
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  private async clearData() {
    console.log('🗑️  Clearing existing data...');
    
    try {
      // Clear tournaments first (due to foreign key constraints)
      const tournaments = await this.tournamentsRepository.find();
      if (tournaments.length > 0) {
        await this.tournamentsRepository.remove(tournaments);
      }

      // Clear teams
      const teams = await this.teamsRepository.find();
      if (teams.length > 0) {
        await this.teamsRepository.remove(teams);
      }

      // Clear players
      const players = await this.playersRepository.find();
      if (players.length > 0) {
        await this.playersRepository.remove(players);
      }

      // Clear users last
      const users = await this.usersRepository.find();
      if (users.length > 0) {
        await this.usersRepository.remove(users);
      }

      console.log('✅ Existing data cleared successfully');
    } catch (error) {
      console.log('ℹ️  No existing data to clear or error occurred:', error.message);
    }
  }

  private async seedUsers(): Promise<User[]> {
    console.log('👥 Seeding users...');
    
    const usersData = [
      {
        fullName: 'Virat Kohli',
        email: 'virat@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543210',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'MS Dhoni',
        email: 'dhoni@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543211',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'Rohit Sharma',
        email: 'rohit@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543212',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'Jasprit Bumrah',
        email: 'bumrah@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543213',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'Hardik Pandya',
        email: 'hardik@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543214',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'KL Rahul',
        email: 'rahul@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543215',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'Ravindra Jadeja',
        email: 'jadeja@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543216',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'Shikhar Dhawan',
        email: 'dhawan@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543217',
        role: UserRole.PLAYER,
        isActive: true,
      },
      {
        fullName: 'Tournament Organizer',
        email: 'organizer@cricket.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 9876543218',
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        fullName: 'Demo User',
        email: 'demo@cricket.com',
        password: await bcrypt.hash('demo123', 10),
        phone: '+91 9876543219',
        role: UserRole.PLAYER,
        isActive: true,
      },
    ];

    const users = [];
    for (const userData of usersData) {
      const user = this.usersRepository.create(userData);
      const savedUser = await this.usersRepository.save(user);
      users.push(savedUser);
    }

    return users;
  }

  private async seedPlayers(users: User[]): Promise<Player[]> {
    console.log('🏏 Seeding players...');

    const playersData = [
      {
        role: PlayerRole.BATSMAN,
        battingStyle: BattingStyle.RIGHT_HANDED,
        bowlingStyle: BowlingStyle.RIGHT_ARM_MEDIUM,
        jerseyNumber: 18,
        experience: 15,
        matches: 462,
        runs: 26000,
        wickets: 4,
        average: 52.5,
        strikeRate: 93.2,
        centuries: 70,
        halfCenturies: 133,
        highestScore: 254,
        user: users[0], // Virat Kohli
      },
      {
        role: PlayerRole.WICKET_KEEPER,
        battingStyle: BattingStyle.RIGHT_HANDED,
        bowlingStyle: BowlingStyle.WICKET_KEEPER,
        jerseyNumber: 7,
        experience: 16,
        matches: 538,
        runs: 17266,
        wickets: 0,
        average: 50.6,
        strikeRate: 87.6,
        centuries: 10,
        halfCenturies: 73,
        highestScore: 224,
        user: users[1], // MS Dhoni
      },
      {
        role: PlayerRole.BATSMAN,
        battingStyle: BattingStyle.RIGHT_HANDED,
        bowlingStyle: BowlingStyle.RIGHT_ARM_MEDIUM,
        jerseyNumber: 45,
        experience: 12,
        matches: 408,
        runs: 18000,
        wickets: 8,
        average: 46.8,
        strikeRate: 88.9,
        centuries: 46,
        halfCenturies: 87,
        highestScore: 264,
        user: users[2], // Rohit Sharma
      },
      {
        role: PlayerRole.BOWLER,
        battingStyle: BattingStyle.RIGHT_HANDED,
        bowlingStyle: BowlingStyle.RIGHT_ARM_FAST,
        jerseyNumber: 93,
        experience: 8,
        matches: 203,
        runs: 776,
        wickets: 442,
        average: 20.2,
        strikeRate: 45.6,
        centuries: 0,
        halfCenturies: 0,
        highestScore: 55,
        user: users[3], // Jasprit Bumrah
      },
      {
        role: PlayerRole.ALL_ROUNDER,
        battingStyle: BattingStyle.RIGHT_HANDED,
        bowlingStyle: BowlingStyle.RIGHT_ARM_FAST,
        jerseyNumber: 33,
        experience: 7,
        matches: 184,
        runs: 3564,
        wickets: 178,
        average: 31.9,
        strikeRate: 113.8,
        centuries: 4,
        halfCenturies: 19,
        highestScore: 158,
        user: users[4], // Hardik Pandya
      },
      {
        role: PlayerRole.WICKET_KEEPER,
        battingStyle: BattingStyle.RIGHT_HANDED,
        bowlingStyle: BowlingStyle.WICKET_KEEPER,
        jerseyNumber: 1,
        experience: 9,
        matches: 167,
        runs: 5554,
        wickets: 0,
        average: 45.9,
        strikeRate: 86.8,
        centuries: 13,
        halfCenturies: 26,
        highestScore: 199,
        user: users[5], // KL Rahul
      },
      {
        role: PlayerRole.ALL_ROUNDER,
        battingStyle: BattingStyle.LEFT_HANDED,
        bowlingStyle: BowlingStyle.LEFT_ARM_SPIN,
        jerseyNumber: 8,
        experience: 13,
        matches: 266,
        runs: 5500,
        wickets: 358,
        average: 33.6,
        strikeRate: 68.2,
        centuries: 3,
        halfCenturies: 35,
        highestScore: 175,
        user: users[6], // Ravindra Jadeja
      },
      {
        role: PlayerRole.BATSMAN,
        battingStyle: BattingStyle.LEFT_HANDED,
        bowlingStyle: BowlingStyle.RIGHT_ARM_MEDIUM,
        jerseyNumber: 25,
        experience: 14,
        matches: 341,
        runs: 12779,
        wickets: 19,
        average: 41.0,
        strikeRate: 95.7,
        centuries: 17,
        halfCenturies: 69,
        highestScore: 143,
        user: users[7], // Shikhar Dhawan
      },
    ];

    const players = [];
    for (const playerData of playersData) {
      const player = this.playersRepository.create(playerData);
      const savedPlayer = await this.playersRepository.save(player);
      players.push(savedPlayer);
    }

    return players;
  }

  private async seedTeams(players: Player[]): Promise<Team[]> {
    console.log('🛡️  Seeding teams...');

    // Get the user entities for captains (players have user relations)
    const teamsData = [
      {
        name: 'Mumbai Indians',
        logo: 'https://example.com/mi-logo.png',
        city: 'Mumbai',
        description: 'Most successful IPL team with 5 titles',
        matchesPlayed: 198,
        matchesWon: 120,
        matchesLost: 78,
        matchesDrawn: 0,
        isActive: true,
        captain: players[2].user, // Rohit Sharma's user
        players: [players[2], players[3], players[4]], // Rohit, Bumrah, Hardik
      },
      {
        name: 'Chennai Super Kings',
        logo: 'https://example.com/csk-logo.png',
        city: 'Chennai',
        description: 'Yellow Army with 4 IPL titles',
        matchesPlayed: 194,
        matchesWon: 106,
        matchesLost: 88,
        matchesDrawn: 0,
        isActive: true,
        captain: players[1].user, // MS Dhoni's user
        players: [players[1], players[6]], // Dhoni, Jadeja
      },
      {
        name: 'Royal Challengers Bangalore',
        logo: 'https://example.com/rcb-logo.png',
        city: 'Bangalore',
        description: 'Play Bold team with passionate fanbase',
        matchesPlayed: 194,
        matchesWon: 88,
        matchesLost: 106,
        matchesDrawn: 0,
        isActive: true,
        captain: players[0].user, // Virat Kohli's user
        players: [players[0]], // Virat
      },
      {
        name: 'Punjab Kings',
        logo: 'https://example.com/pbks-logo.png',
        city: 'Mohali',
        description: 'Kings XI Punjab rebranded as Punjab Kings',
        matchesPlayed: 194,
        matchesWon: 78,
        matchesLost: 116,
        matchesDrawn: 0,
        isActive: true,
        captain: players[5].user, // KL Rahul's user
        players: [players[5], players[7]], // Rahul, Dhawan
      },
    ];

    const teams = [];
    for (const teamData of teamsData) {
      const team = this.teamsRepository.create(teamData);
      const savedTeam = await this.teamsRepository.save(team);
      teams.push(savedTeam);
    }

    return teams;
  }

  private async seedTournaments(users: User[], teams: Team[]): Promise<Tournament[]> {
    console.log('🏆 Seeding tournaments...');

    const tournamentsData = [
      {
        name: 'Indian Premier League 2024',
        description: 'The biggest T20 cricket league in the world',
        format: TournamentFormat.T20,
        startDate: new Date('2024-03-22'),
        endDate: new Date('2024-05-26'),
        location: 'India',
        maxTeams: 10,
        prizePool: 50000000,
        status: TournamentStatus.COMPLETED,
        organizer: users[8], // Tournament Organizer
        teams: [teams[0], teams[1], teams[2], teams[3]],
      },
      {
        name: 'World Cup Cricket 2023',
        description: '50-over Cricket World Cup',
        format: TournamentFormat.ODI,
        startDate: new Date('2023-10-05'),
        endDate: new Date('2023-11-19'),
        location: 'India',
        maxTeams: 10,
        prizePool: 10000000,
        status: TournamentStatus.COMPLETED,
        organizer: users[8],
        teams: [teams[0], teams[1]],
      },
      {
        name: 'T20 World Cup 2024',
        description: 'ICC T20 World Cup',
        format: TournamentFormat.T20,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-29'),
        location: 'USA & West Indies',
        maxTeams: 20,
        prizePool: 15000000,
        status: TournamentStatus.COMPLETED,
        organizer: users[8],
        teams: [teams[0], teams[1], teams[2]],
      },
      {
        name: 'Champions Trophy 2025',
        description: 'ICC Champions Trophy',
        format: TournamentFormat.ODI,
        startDate: new Date('2025-02-19'),
        endDate: new Date('2025-03-09'),
        location: 'Pakistan',
        maxTeams: 8,
        prizePool: 8000000,
        status: TournamentStatus.UPCOMING,
        organizer: users[8],
        teams: [teams[0], teams[1], teams[2], teams[3]],
      },
      {
        name: 'IPL 2025',
        description: 'Indian Premier League Season 18',
        format: TournamentFormat.T20,
        startDate: new Date('2025-03-20'),
        endDate: new Date('2025-05-25'),
        location: 'India',
        maxTeams: 10,
        prizePool: 60000000,
        status: TournamentStatus.UPCOMING,
        organizer: users[8],
        teams: [teams[0], teams[1], teams[2], teams[3]],
      },
    ];

    const tournaments = [];
    for (const tournamentData of tournamentsData) {
      const tournament = this.tournamentsRepository.create(tournamentData);
      const savedTournament = await this.tournamentsRepository.save(tournament);
      tournaments.push(savedTournament);
    }

    return tournaments;
  }
}