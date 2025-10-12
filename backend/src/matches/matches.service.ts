import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus, MatchType } from './entities/match.entity';
import { Ball } from './entities/ball.entity';
import { Scorecard } from './entities/scorecard.entity';
import { TournamentGroup } from './entities/group.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { User } from '../users/entities/user.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { CreateScorecardDto } from './dto/create-scorecard.dto';
import { AddBallDto } from './dto/add-ball.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Ball)
    private ballRepository: Repository<Ball>,
    @InjectRepository(Scorecard)
    private scorecardRepository: Repository<Scorecard>,
    @InjectRepository(TournamentGroup)
    private groupRepository: Repository<TournamentGroup>,
    @InjectRepository(TournamentTeam)
    private tournamentTeamRepository: Repository<TournamentTeam>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ==================== MATCH CRUD ====================

  async createMatch(createMatchDto: CreateMatchDto): Promise<Match> {
    const teamA = await this.teamRepository.findOne({ where: { id: createMatchDto.teamAId } });
    const teamB = await this.teamRepository.findOne({ where: { id: createMatchDto.teamBId } });

    if (!teamA || !teamB) {
      throw new NotFoundException('One or both teams not found');
    }

    if (teamA.id === teamB.id) {
      throw new BadRequestException('A team cannot play against itself');
    }

    const match = this.matchRepository.create({
      matchType: createMatchDto.matchType,
      teamA,
      teamB,
      matchDate: new Date(createMatchDto.matchDate),
      venue: createMatchDto.venue,
      city: createMatchDto.city,
      overs: createMatchDto.overs || 20,
      groupName: createMatchDto.groupName,
      stage: createMatchDto.stage,
    });

    if (createMatchDto.tournamentId) {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: createMatchDto.tournamentId }
      });
      if (tournament) {
        match.tournament = tournament;
      }
    }

    return this.matchRepository.save(match);
  }

  async getAllMatches(filters?: any): Promise<Match[]> {
    const query = this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.teamA', 'teamA')
      .leftJoinAndSelect('match.teamB', 'teamB')
      .leftJoinAndSelect('match.winner', 'winner')
      .leftJoinAndSelect('match.tournament', 'tournament')
      .where('match.isActive = :isActive', { isActive: true });

    if (filters?.status) {
      query.andWhere('match.status = :status', { status: filters.status });
    }

    if (filters?.tournamentId) {
      query.andWhere('match.tournamentId = :tournamentId', { tournamentId: filters.tournamentId });
    }

    if (filters?.teamId) {
      query.andWhere('(teamA.id = :teamId OR teamB.id = :teamId)', { teamId: filters.teamId });
    }

    query.orderBy('match.matchDate', 'DESC');

    return query.getMany();
  }

  async getMatchById(id: number): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id, isActive: true },
      relations: ['teamA', 'teamB', 'winner', 'tournament', 'manOfTheMatch'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Increment view count
    match.viewCount += 1;
    await this.matchRepository.save(match);

    return match;
  }

  async updateMatchResult(id: number, result: UpdateMatchResultDto): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ['teamA', 'teamB', 'tournament'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (result.status) {
      match.status = result.status;
    }

    if (result.winnerId) {
      const winner = await this.teamRepository.findOne({ where: { id: result.winnerId } });
      if (winner) {
        match.winner = winner;
      }
    }

    if (result.teamAScore) {
      match.teamAScore = result.teamAScore;
    }

    if (result.teamBScore) {
      match.teamBScore = result.teamBScore;
    }

    if (result.matchSummary) {
      match.matchSummary = result.matchSummary;
    }

    if (result.manOfTheMatchId) {
      const player = await this.userRepository.findOne({ where: { id: result.manOfTheMatchId } });
      if (player) {
        match.manOfTheMatch = player;
      }
    }

    const updatedMatch = await this.matchRepository.save(match);

    // Update points table if tournament match and completed
    if (match.matchType === MatchType.TOURNAMENT && match.status === MatchStatus.COMPLETED && match.tournament) {
      await this.updatePointsTableAfterMatch(match);
    }

    return updatedMatch;
  }

  async deleteMatch(id: number): Promise<void> {
    const match = await this.matchRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    match.isActive = false;
    await this.matchRepository.save(match);
  }

  // ==================== BALL-BY-BALL TRACKING ====================

  async addBall(addBallDto: AddBallDto): Promise<Ball> {
    const match = await this.matchRepository.findOne({
      where: { id: addBallDto.matchId },
      relations: ['teamA', 'teamB'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const batsman = await this.playerRepository.findOne({ where: { id: addBallDto.batsmanId } });
    const bowler = await this.playerRepository.findOne({ where: { id: addBallDto.bowlerId } });
    const battingTeam = await this.teamRepository.findOne({ where: { id: addBallDto.battingTeamId } });
    const bowlingTeam = await this.teamRepository.findOne({ where: { id: addBallDto.bowlingTeamId } });

    if (!batsman || !bowler || !battingTeam || !bowlingTeam) {
      throw new NotFoundException('Player or team not found');
    }

    // Calculate ball number
    const ballCount = await this.ballRepository.count({ where: { match: { id: match.id } } });

    const ball = this.ballRepository.create({
      match,
      battingTeam,
      bowlingTeam,
      overNumber: addBallDto.overNumber,
      ballNumber: ballCount + 1,
      batsman,
      bowler,
      outcome: addBallDto.outcome,
      runs: addBallDto.runs,
      extras: addBallDto.extras || 0,
      isWicket: addBallDto.isWicket || false,
      wicketType: addBallDto.wicketType,
      commentary: addBallDto.commentary,
      isBoundary: addBallDto.runs === 4 || addBallDto.runs === 6,
      isLegal: !['wide', 'no_ball'].includes(addBallDto.outcome),
    });

    if (addBallDto.nonStrikerId) {
      const nonStriker = await this.playerRepository.findOne({ where: { id: addBallDto.nonStrikerId } });
      if (nonStriker) {
        ball.nonStriker = nonStriker;
      }
    }

    if (addBallDto.fielderId) {
      const fielder = await this.playerRepository.findOne({ where: { id: addBallDto.fielderId } });
      if (fielder) {
        ball.fielder = fielder;
      }
    }

    const savedBall = await this.ballRepository.save(ball);

    // Auto-update scorecards
    await this.updateScorecardFromBall(savedBall);

    // Update match status if not already live
    if (match.status === MatchStatus.SCHEDULED) {
      match.status = MatchStatus.LIVE;
      await this.matchRepository.save(match);
    }

    return savedBall;
  }

  async getMatchBalls(matchId: number): Promise<Ball[]> {
    return this.ballRepository.find({
      where: { match: { id: matchId } },
      relations: ['batsman', 'bowler', 'nonStriker', 'fielder', 'battingTeam', 'bowlingTeam'],
      order: { ballNumber: 'ASC' },
    });
  }

  async undoLastBall(matchId: number): Promise<void> {
    const lastBall = await this.ballRepository.findOne({
      where: { match: { id: matchId } },
      order: { ballNumber: 'DESC' },
    });

    if (!lastBall) {
      throw new NotFoundException('No balls to undo');
    }

    // Revert scorecard updates
    await this.revertScorecardFromBall(lastBall);

    // Delete the ball
    await this.ballRepository.remove(lastBall);
  }

  async getCurrentMatchState(matchId: number): Promise<any> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['teamA', 'teamB'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const balls = await this.getMatchBalls(matchId);
    const scorecards = await this.getMatchScorecard(matchId);

    // Calculate current score
    const teamABalls = balls.filter(b => b.battingTeam.id === match.teamA.id);
    const teamBBalls = balls.filter(b => b.battingTeam.id === match.teamB.id);

    const teamAScore = this.calculateTeamScore(teamABalls);
    const teamBScore = this.calculateTeamScore(teamBBalls);

    return {
      match,
      teamAScore,
      teamBScore,
      recentBalls: balls.slice(-6),
      scorecards,
    };
  }

  private calculateTeamScore(balls: Ball[]): any {
    const runs = balls.reduce((sum, ball) => sum + ball.runs + ball.extras, 0);
    const wickets = balls.filter(ball => ball.isWicket).length;
    const legalBalls = balls.filter(ball => ball.isLegal).length;
    const overs = Math.floor(legalBalls / 6) + (legalBalls % 6) / 10;

    return {
      runs,
      wickets,
      overs: overs.toFixed(1),
      score: `${runs}/${wickets}`,
    };
  }

  // ==================== SCORECARD MANAGEMENT ====================

  async addScorecard(createScorecardDto: CreateScorecardDto): Promise<Scorecard> {
    const match = await this.matchRepository.findOne({ where: { id: createScorecardDto.matchId } });
    const player = await this.playerRepository.findOne({ where: { id: createScorecardDto.playerId } });
    const team = await this.teamRepository.findOne({ where: { id: createScorecardDto.teamId } });

    if (!match || !player || !team) {
      throw new NotFoundException('Match, player, or team not found');
    }

    const scorecard = this.scorecardRepository.create({
      match,
      player,
      team,
      runs: createScorecardDto.runs || 0,
      balls: createScorecardDto.balls || 0,
      fours: createScorecardDto.fours || 0,
      sixes: createScorecardDto.sixes || 0,
      isOut: createScorecardDto.isOut || false,
      dismissalType: createScorecardDto.dismissalType,
      oversBowled: createScorecardDto.oversBowled || 0,
      wickets: createScorecardDto.wickets || 0,
      runsConceded: createScorecardDto.runsConceded || 0,
      maidens: createScorecardDto.maidens || 0,
      catches: createScorecardDto.catches || 0,
      runOuts: createScorecardDto.runOuts || 0,
      stumpings: createScorecardDto.stumpings || 0,
    });

    // Calculate strike rate and economy
    if (scorecard.balls > 0) {
      scorecard.strikeRate = parseFloat(((scorecard.runs / scorecard.balls) * 100).toFixed(2));
    }

    if (scorecard.oversBowled > 0) {
      scorecard.economy = parseFloat((scorecard.runsConceded / scorecard.oversBowled).toFixed(2));
    }

    return this.scorecardRepository.save(scorecard);
  }

  async getMatchScorecard(matchId: number): Promise<any> {
    const scorecards = await this.scorecardRepository.find({
      where: { match: { id: matchId } },
      relations: ['player', 'player.user', 'team'],
      order: { runs: 'DESC' },
    });

    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['teamA', 'teamB'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const teamAScores = scorecards.filter(s => s.team.id === match.teamA.id);
    const teamBScores = scorecards.filter(s => s.team.id === match.teamB.id);

    return {
      teamA: {
        team: match.teamA,
        batting: teamAScores.filter(s => s.balls > 0),
        bowling: teamBScores.filter(s => s.oversBowled > 0),
      },
      teamB: {
        team: match.teamB,
        batting: teamBScores.filter(s => s.balls > 0),
        bowling: teamAScores.filter(s => s.oversBowled > 0),
      },
    };
  }

  private async updateScorecardFromBall(ball: Ball): Promise<void> {
    // Update batsman scorecard
    let batsmanCard = await this.scorecardRepository.findOne({
      where: {
        match: { id: ball.match.id },
        player: { id: ball.batsman.id },
        team: { id: ball.battingTeam.id },
      },
    });

    if (!batsmanCard) {
      batsmanCard = this.scorecardRepository.create({
        match: ball.match,
        player: ball.batsman,
        team: ball.battingTeam,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isOut: false,
        oversBowled: 0,
        wickets: 0,
        runsConceded: 0,
        maidens: 0,
        economy: 0,
        catches: 0,
        runOuts: 0,
        stumpings: 0,
        isPlayerOfMatch: false,
      });
    }

    if (ball.isLegal) {
      batsmanCard.balls = (batsmanCard.balls || 0) + 1;
    }
    batsmanCard.runs = (batsmanCard.runs || 0) + ball.runs;
    if (ball.runs === 4) batsmanCard.fours = (batsmanCard.fours || 0) + 1;
    if (ball.runs === 6) batsmanCard.sixes = (batsmanCard.sixes || 0) + 1;
    if (ball.isWicket) {
      batsmanCard.isOut = true;
      batsmanCard.dismissalType = ball.wicketType;
    }
    if (batsmanCard.balls > 0) {
      batsmanCard.strikeRate = parseFloat(((batsmanCard.runs / batsmanCard.balls) * 100).toFixed(2));
    }

    await this.scorecardRepository.save(batsmanCard);

    // Update bowler scorecard
    let bowlerCard = await this.scorecardRepository.findOne({
      where: {
        match: { id: ball.match.id },
        player: { id: ball.bowler.id },
        team: { id: ball.bowlingTeam.id },
      },
    });

    if (!bowlerCard) {
      bowlerCard = this.scorecardRepository.create({
        match: ball.match,
        player: ball.bowler,
        team: ball.bowlingTeam,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isOut: false,
        oversBowled: 0,
        wickets: 0,
        runsConceded: 0,
        maidens: 0,
        economy: 0,
        catches: 0,
        runOuts: 0,
        stumpings: 0,
        isPlayerOfMatch: false,
      });
    }

    if (ball.isLegal) {
      const ballsThisOver = await this.ballRepository.count({
        where: {
          match: { id: ball.match.id },
          bowler: { id: ball.bowler.id },
          isLegal: true,
        },
      });
      bowlerCard.oversBowled = parseFloat((Math.floor(ballsThisOver / 6) + (ballsThisOver % 6) / 10).toFixed(1));
    }

    bowlerCard.runsConceded = (bowlerCard.runsConceded || 0) + ball.runs + ball.extras;
    if (ball.isWicket) {
      bowlerCard.wickets = (bowlerCard.wickets || 0) + 1;
    }
    if (bowlerCard.oversBowled > 0) {
      bowlerCard.economy = parseFloat((bowlerCard.runsConceded / bowlerCard.oversBowled).toFixed(2));
    }

    await this.scorecardRepository.save(bowlerCard);
  }

  private async revertScorecardFromBall(ball: Ball): Promise<void> {
    // Revert batsman stats
    const batsmanCard = await this.scorecardRepository.findOne({
      where: {
        match: { id: ball.match.id },
        player: { id: ball.batsman.id },
      },
    });

    if (batsmanCard) {
      if (ball.isLegal) {
        batsmanCard.balls = Math.max(0, batsmanCard.balls - 1);
      }
      batsmanCard.runs = Math.max(0, batsmanCard.runs - ball.runs);
      if (ball.runs === 4) batsmanCard.fours = Math.max(0, batsmanCard.fours - 1);
      if (ball.runs === 6) batsmanCard.sixes = Math.max(0, batsmanCard.sixes - 1);
      if (ball.isWicket) {
        batsmanCard.isOut = false;
        batsmanCard.dismissalType = null;
      }
      if (batsmanCard.balls > 0) {
        batsmanCard.strikeRate = parseFloat(((batsmanCard.runs / batsmanCard.balls) * 100).toFixed(2));
      }
      await this.scorecardRepository.save(batsmanCard);
    }

    // Revert bowler stats (similar logic)
    const bowlerCard = await this.scorecardRepository.findOne({
      where: {
        match: { id: ball.match.id },
        player: { id: ball.bowler.id },
      },
    });

    if (bowlerCard) {
      bowlerCard.runsConceded = Math.max(0, bowlerCard.runsConceded - ball.runs - ball.extras);
      if (ball.isWicket) {
        bowlerCard.wickets = Math.max(0, bowlerCard.wickets - 1);
      }
      // Recalculate overs and economy
      if (bowlerCard.oversBowled > 0) {
        bowlerCard.economy = parseFloat((bowlerCard.runsConceded / bowlerCard.oversBowled).toFixed(2));
      }
      await this.scorecardRepository.save(bowlerCard);
    }
  }

  // ==================== LEADERBOARDS ====================

  async getMatchLeaderboard(matchId: number): Promise<any> {
    const scorecards = await this.scorecardRepository.find({
      where: { match: { id: matchId } },
      relations: ['player', 'player.user'],
    });

    const topBatsmen = scorecards
      .filter(s => s.balls > 0)
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 3);

    const topBowlers = scorecards
      .filter(s => s.oversBowled > 0)
      .sort((a, b) => b.wickets - a.wickets || a.economy - b.economy)
      .slice(0, 3);

    const bestFielder = scorecards
      .filter(s => (s.catches + s.runOuts + s.stumpings) > 0)
      .sort((a, b) => (b.catches + b.runOuts + b.stumpings) - (a.catches + a.runOuts + a.stumpings))[0];

    return {
      topBatsmen,
      topBowlers,
      bestFielder,
    };
  }

  async getTournamentLeaderboard(tournamentId: number, type: string = 'batting'): Promise<any> {
    const matches = await this.matchRepository.find({
      where: { tournament: { id: tournamentId }, status: MatchStatus.COMPLETED },
    });

    const matchIds = matches.map(m => m.id);

    const scorecards = await this.scorecardRepository
      .createQueryBuilder('scorecard')
      .leftJoinAndSelect('scorecard.player', 'player')
      .leftJoinAndSelect('player.user', 'user')
      .where('scorecard.matchId IN (:...matchIds)', { matchIds })
      .getMany();

    if (type === 'batting') {
      // Group by player and sum stats
      const playerStats = new Map();

      scorecards.filter(s => s.balls > 0).forEach(scorecard => {
        const playerId = scorecard.player.id;
        if (!playerStats.has(playerId)) {
          playerStats.set(playerId, {
            player: scorecard.player,
            totalRuns: 0,
            totalBalls: 0,
            matches: 0,
            fours: 0,
            sixes: 0,
            fifties: 0,
            hundreds: 0,
            highestScore: 0,
          });
        }

        const stats = playerStats.get(playerId);
        stats.totalRuns += scorecard.runs;
        stats.totalBalls += scorecard.balls;
        stats.matches += 1;
        stats.fours += scorecard.fours;
        stats.sixes += scorecard.sixes;
        if (scorecard.runs >= 50 && scorecard.runs < 100) stats.fifties += 1;
        if (scorecard.runs >= 100) stats.hundreds += 1;
        if (scorecard.runs > stats.highestScore) stats.highestScore = scorecard.runs;
      });

      const leaderboard = Array.from(playerStats.values()).map(stats => ({
        ...stats,
        average: stats.matches > 0 ? parseFloat((stats.totalRuns / stats.matches).toFixed(2)) : 0,
        strikeRate: stats.totalBalls > 0 ? parseFloat(((stats.totalRuns / stats.totalBalls) * 100).toFixed(2)) : 0,
      })).sort((a, b) => b.totalRuns - a.totalRuns);

      return leaderboard;
    }

    if (type === 'bowling') {
      const playerStats = new Map();

      scorecards.filter(s => s.oversBowled > 0).forEach(scorecard => {
        const playerId = scorecard.player.id;
        if (!playerStats.has(playerId)) {
          playerStats.set(playerId, {
            player: scorecard.player,
            totalWickets: 0,
            totalOvers: 0,
            totalRunsConceded: 0,
            matches: 0,
            maidens: 0,
            bestFigures: '',
          });
        }

        const stats = playerStats.get(playerId);
        stats.totalWickets += scorecard.wickets;
        stats.totalOvers += scorecard.oversBowled;
        stats.totalRunsConceded += scorecard.runsConceded;
        stats.matches += 1;
        stats.maidens += scorecard.maidens;
      });

      const leaderboard = Array.from(playerStats.values()).map(stats => ({
        ...stats,
        economy: stats.totalOvers > 0 ? parseFloat((stats.totalRunsConceded / stats.totalOvers).toFixed(2)) : 0,
        average: stats.totalWickets > 0 ? parseFloat((stats.totalRunsConceded / stats.totalWickets).toFixed(2)) : 0,
      })).sort((a, b) => b.totalWickets - a.totalWickets);

      return leaderboard;
    }

    return [];
  }

  // ==================== POINTS TABLE ====================

  async getPointsTable(tournamentId: number): Promise<any> {
    const groups = await this.groupRepository.find({
      where: { tournament: { id: tournamentId } },
    });

    const result = [];

    for (const group of groups) {
      const teams = await this.tournamentTeamRepository.find({
        where: { tournament: { id: tournamentId }, group: { id: group.id } },
        relations: ['team'],
        order: { points: 'DESC', netRunRate: 'DESC' },
      });

      result.push({
        groupName: group.name,
        teams,
      });
    }

    return result;
  }

  private async updatePointsTableAfterMatch(match: Match): Promise<void> {
    if (!match.winner || !match.tournament) {
      return;
    }

    const loser = match.winner.id === match.teamA.id ? match.teamB : match.teamA;

    // Update winner
    await this.updateTeamStats(match.winner.id, match.tournament.id, true, match);

    // Update loser
    await this.updateTeamStats(loser.id, match.tournament.id, false, match);
  }

  private async updateTeamStats(teamId: number, tournamentId: number, won: boolean, match: Match): Promise<void> {
    let teamStats = await this.tournamentTeamRepository.findOne({
      where: { team: { id: teamId }, tournament: { id: tournamentId } },
    });

    if (!teamStats) {
      const team = await this.teamRepository.findOne({ where: { id: teamId } });
      const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId } });
      
      teamStats = this.tournamentTeamRepository.create({
        team,
        tournament,
      });
    }

    teamStats.matchesPlayed += 1;
    if (won) {
      teamStats.wins += 1;
      teamStats.points += 2;
    } else {
      teamStats.losses += 1;
    }

    // Update NRR fields (simplified - parse from teamAScore/teamBScore)
    const scoreData = this.parseScore(teamId === match.teamA.id ? match.teamAScore : match.teamBScore);
    const oppScoreData = this.parseScore(teamId === match.teamA.id ? match.teamBScore : match.teamAScore);

    if (scoreData && oppScoreData) {
      teamStats.runsScored += scoreData.runs;
      teamStats.runsConceded += oppScoreData.runs;
      teamStats.oversFaced += scoreData.overs;
      teamStats.oversBowled += oppScoreData.overs;

      // Calculate NRR
      if (teamStats.oversFaced > 0 && teamStats.oversBowled > 0) {
        const runRateFor = teamStats.runsScored / teamStats.oversFaced;
        const runRateAgainst = teamStats.runsConceded / teamStats.oversBowled;
        teamStats.netRunRate = parseFloat((runRateFor - runRateAgainst).toFixed(3));
      }
    }

    await this.tournamentTeamRepository.save(teamStats);
  }

  private parseScore(scoreString: string): { runs: number, overs: number } | null {
    if (!scoreString) return null;

    // Format: "180/7" or "180/7 (20.0)"
    const match = scoreString.match(/(\d+)\/\d+/);
    if (!match) return null;

    const runs = parseInt(match[1]);
    
    // Try to extract overs from string
    const oversMatch = scoreString.match(/\(([0-9.]+)\)/);
    const overs = oversMatch ? parseFloat(oversMatch[1]) : 20.0;

    return { runs, overs };
  }

  // ==================== TOURNAMENT MANAGEMENT ====================

  async generateGroupMatches(tournamentId: number): Promise<Match[]> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ['teams'],
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    const groups = await this.groupRepository.find({
      where: { tournament: { id: tournamentId } },
    });

    const matches = [];

    for (const group of groups) {
      const groupTeams = await this.tournamentTeamRepository.find({
        where: { tournament: { id: tournamentId }, group: { id: group.id } },
        relations: ['team'],
      });

      // Round-robin: each team plays every other team
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          const match = this.matchRepository.create({
            matchType: MatchType.TOURNAMENT,
            tournament,
            groupName: group.name,
            stage: 'group' as any,
            teamA: groupTeams[i].team,
            teamB: groupTeams[j].team,
            matchDate: new Date(Date.now() + matches.length * 24 * 60 * 60 * 1000), // Spread over days
            overs: 20,
            status: MatchStatus.SCHEDULED,
          });

          matches.push(match);
        }
      }
    }

    return this.matchRepository.save(matches);
  }

  async generateKnockoutMatches(tournamentId: number): Promise<Match[]> {
    const qualifiedTeams = await this.getQualifiedTeams(tournamentId);

    if (qualifiedTeams.length < 4) {
      throw new BadRequestException('Not enough qualified teams for knockout');
    }

    // Simple semi-final logic (can be enhanced)
    const match = [];
    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId } });

    const semiFinal1 = this.matchRepository.create({
      matchType: MatchType.TOURNAMENT,
      tournament,
      stage: 'semi_final' as any,
      teamA: qualifiedTeams[0],
      teamB: qualifiedTeams[3],
      matchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      overs: 20,
    });

    const semiFinal2 = this.matchRepository.create({
      matchType: MatchType.TOURNAMENT,
      tournament,
      stage: 'semi_final' as any,
      teamA: qualifiedTeams[1],
      teamB: qualifiedTeams[2],
      matchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      overs: 20,
    });

    return this.matchRepository.save([semiFinal1, semiFinal2]);
  }

  async getQualifiedTeams(tournamentId: number): Promise<Team[]> {
    const teamStats = await this.tournamentTeamRepository.find({
      where: { tournament: { id: tournamentId }, isQualified: true },
      relations: ['team'],
      order: { points: 'DESC', netRunRate: 'DESC' },
    });

    return teamStats.map(ts => ts.team);
  }

  async advanceTeamsToKnockout(tournamentId: number, teamIds: number[]): Promise<void> {
    for (const teamId of teamIds) {
      const teamStat = await this.tournamentTeamRepository.findOne({
        where: { team: { id: teamId }, tournament: { id: tournamentId } },
      });

      if (teamStat) {
        teamStat.isQualified = true;
        await this.tournamentTeamRepository.save(teamStat);
      }
    }
  }
}


