import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TournamentsService } from './tournaments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @ApiOperation({ summary: 'Create new tournament' })
  @ApiResponse({ status: 201, description: 'Tournament created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTournamentDto: any) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @ApiOperation({ summary: 'Get all tournaments' })
  @ApiResponse({ status: 200, description: 'Tournaments retrieved successfully' })
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @ApiOperation({ summary: 'Get tournament by ID' })
  @ApiResponse({ status: 200, description: 'Tournament retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update tournament' })
  @ApiResponse({ status: 200, description: 'Tournament updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTournamentDto: any) {
    return this.tournamentsService.update(+id, updateTournamentDto);
  }

  @ApiOperation({ summary: 'Delete tournament' })
  @ApiResponse({ status: 200, description: 'Tournament deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }

  @ApiOperation({ summary: 'Add team to tournament' })
  @ApiResponse({ status: 200, description: 'Team added to tournament successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':tournamentId/teams/:teamId')
  addTeamToTournament(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.tournamentsService.addTeamToTournament(+tournamentId, +teamId);
  }

  @ApiOperation({ summary: 'Remove team from tournament' })
  @ApiResponse({ status: 200, description: 'Team removed from tournament successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':tournamentId/teams/:teamId')
  removeTeamFromTournament(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.tournamentsService.removeTeamFromTournament(+tournamentId, +teamId);
  }
}