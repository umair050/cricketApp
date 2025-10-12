import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({ summary: 'Create new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTeamDto: any, @Req() req: any) {
    return this.teamsService.create(createTeamDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'Teams retrieved successfully' })
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @ApiOperation({ summary: 'Get team by ID' })
  @ApiResponse({ status: 200, description: 'Team retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update team' })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: any) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  @ApiOperation({ summary: 'Delete team' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }

  @ApiOperation({ summary: 'Add player to team' })
  @ApiResponse({ status: 200, description: 'Player added to team successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':teamId/players/:playerId')
  addPlayerToTeam(
    @Param('teamId') teamId: string,
    @Param('playerId') playerId: string,
  ) {
    return this.teamsService.addPlayerToTeam(+teamId, +playerId);
  }

  @ApiOperation({ summary: 'Remove player from team' })
  @ApiResponse({ status: 200, description: 'Player removed from team successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':teamId/players/:playerId')
  removePlayerFromTeam(
    @Param('teamId') teamId: string,
    @Param('playerId') playerId: string,
  ) {
    return this.teamsService.removePlayerFromTeam(+teamId, +playerId);
  }
}