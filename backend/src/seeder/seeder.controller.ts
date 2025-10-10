import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeederService } from './seeder.service';

@ApiTags('Database Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('seed-all')
  @ApiOperation({ 
    summary: 'Seed database with fake data',
    description: 'Populates the database with sample users, players, teams, and tournaments for testing purposes'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Database seeded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        created: {
          type: 'object',
          properties: {
            users: { type: 'number' },
            players: { type: 'number' },
            teams: { type: 'number' },
            tournaments: { type: 'number' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async seedDatabase() {
    return await this.seederService.seedAll();
  }
}