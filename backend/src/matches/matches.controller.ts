import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { CreateScorecardDto } from './dto/create-scorecard.dto';
import { AddBallDto } from './dto/add-ball.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Create a new match (friendly or tournament)' })
  @ApiResponse({ status: 201, description: 'Match created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createMatch(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.createMatch(createMatchDto);
  }

  @ApiOperation({ summary: 'Get all matches with filters' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  @Get()
  getAllMatches(@Query() filters: any) {
    return this.matchesService.getAllMatches(filters);
  }

  @ApiOperation({ summary: 'Get match by ID' })
  @ApiResponse({ status: 200, description: 'Match retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  @Get(':id')
  getMatchById(@Param('id') id: string) {
    return this.matchesService.getMatchById(+id);
  }

  @ApiOperation({ summary: 'Update match result' })
  @ApiResponse({ status: 200, description: 'Match updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/result')
  updateMatchResult(
    @Param('id') id: string,
    @Body() result: UpdateMatchResultDto,
  ) {
    return this.matchesService.updateMatchResult(+id, result);
  }

  @ApiOperation({ summary: 'Delete a match' })
  @ApiResponse({ status: 204, description: 'Match deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMatch(@Param('id') id: string) {
    return this.matchesService.deleteMatch(+id);
  }

  // ==================== BALL-BY-BALL SCORING ====================

  @ApiOperation({ summary: 'Add a ball to the match (ball-by-ball scoring)' })
  @ApiResponse({ status: 201, description: 'Ball added successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/balls')
  @HttpCode(HttpStatus.CREATED)
  addBall(@Param('id') id: string, @Body() addBallDto: AddBallDto) {
    addBallDto.matchId = +id;
    return this.matchesService.addBall(addBallDto);
  }

  @ApiOperation({ summary: 'Get all balls for a match' })
  @ApiResponse({ status: 200, description: 'Balls retrieved successfully' })
  @Get(':id/balls')
  getMatchBalls(@Param('id') id: string) {
    return this.matchesService.getMatchBalls(+id);
  }

  @ApiOperation({ summary: 'Undo the last ball' })
  @ApiResponse({ status: 204, description: 'Ball undone successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/balls/undo')
  @HttpCode(HttpStatus.NO_CONTENT)
  undoLastBall(@Param('id') id: string) {
    return this.matchesService.undoLastBall(+id);
  }

  @ApiOperation({ summary: 'Get current match state (live score)' })
  @ApiResponse({ status: 200, description: 'Match state retrieved successfully' })
  @Get(':id/live-score')
  getCurrentMatchState(@Param('id') id: string) {
    return this.matchesService.getCurrentMatchState(+id);
  }

  // ==================== SCORECARDS ====================

  @ApiOperation({ summary: 'Add scorecard for a player' })
  @ApiResponse({ status: 201, description: 'Scorecard added successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/scorecard')
  @HttpCode(HttpStatus.CREATED)
  addScorecard(@Body() createScorecardDto: CreateScorecardDto) {
    return this.matchesService.addScorecard(createScorecardDto);
  }

  @ApiOperation({ summary: 'Get match scorecard' })
  @ApiResponse({ status: 200, description: 'Scorecard retrieved successfully' })
  @Get(':id/scorecard')
  getMatchScorecard(@Param('id') id: string) {
    return this.matchesService.getMatchScorecard(+id);
  }

  // ==================== LEADERBOARDS ====================

  @ApiOperation({ summary: 'Get match leaderboard (top performers)' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved successfully' })
  @Get(':id/leaderboard')
  getMatchLeaderboard(@Param('id') id: string) {
    return this.matchesService.getMatchLeaderboard(+id);
  }

  @ApiOperation({ summary: 'Get tournament leaderboard' })
  @ApiResponse({ status: 200, description: 'Tournament leaderboard retrieved successfully' })
  @Get('tournament/:tournamentId/leaderboard')
  getTournamentLeaderboard(
    @Param('tournamentId') tournamentId: string,
    @Query('type') type: string = 'batting',
  ) {
    return this.matchesService.getTournamentLeaderboard(+tournamentId, type);
  }

  @ApiOperation({ summary: 'Get points table for tournament' })
  @ApiResponse({ status: 200, description: 'Points table retrieved successfully' })
  @Get('tournament/:tournamentId/points-table')
  getPointsTable(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.getPointsTable(+tournamentId);
  }

  // ==================== TOURNAMENT MANAGEMENT ====================

  @ApiOperation({ summary: 'Generate group matches (round-robin)' })
  @ApiResponse({ status: 201, description: 'Matches generated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('tournament/:tournamentId/generate-group-matches')
  @HttpCode(HttpStatus.CREATED)
  generateGroupMatches(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.generateGroupMatches(+tournamentId);
  }

  @ApiOperation({ summary: 'Generate knockout matches' })
  @ApiResponse({ status: 201, description: 'Knockout matches generated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('tournament/:tournamentId/generate-knockout-matches')
  @HttpCode(HttpStatus.CREATED)
  generateKnockoutMatches(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.generateKnockoutMatches(+tournamentId);
  }

  @ApiOperation({ summary: 'Advance teams to knockout stage' })
  @ApiResponse({ status: 200, description: 'Teams advanced successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('tournament/:tournamentId/advance-teams')
  advanceTeams(
    @Param('tournamentId') tournamentId: string,
    @Body('teamIds') teamIds: number[],
  ) {
    return this.matchesService.advanceTeamsToKnockout(+tournamentId, teamIds);
  }

  @ApiOperation({ summary: 'Get qualified teams' })
  @ApiResponse({ status: 200, description: 'Qualified teams retrieved' })
  @Get('tournament/:tournamentId/qualified-teams')
  getQualifiedTeams(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.getQualifiedTeams(+tournamentId);
  }
}

