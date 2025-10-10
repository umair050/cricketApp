import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @ApiOperation({ summary: 'Create new player profile' })
  @ApiResponse({ status: 201, description: 'Player created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPlayerDto: any) {
    return this.playersService.create(createPlayerDto);
  }

  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({ status: 200, description: 'Players retrieved successfully' })
  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @ApiOperation({ summary: 'Search players by location' })
  @ApiResponse({ status: 200, description: 'Players found' })
  @Get('search')
  searchByLocation(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
  ) {
    return this.playersService.findByLocation(city, state, country);
  }

  @ApiOperation({ summary: 'Get player by ID' })
  @ApiResponse({ status: 200, description: 'Player retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update player profile' })
  @ApiResponse({ status: 200, description: 'Player updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: any) {
    return this.playersService.update(+id, updatePlayerDto);
  }

  @ApiOperation({ summary: 'Delete player' })
  @ApiResponse({ status: 200, description: 'Player deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}