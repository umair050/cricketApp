import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { Ball } from './entities/ball.entity';
import { Scorecard } from './entities/scorecard.entity';
import { TournamentGroup } from './entities/group.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      Ball,
      Scorecard,
      TournamentGroup,
      TournamentTeam,
      Team,
      Player,
      Tournament,
      User,
    ]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}



