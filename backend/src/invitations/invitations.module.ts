import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { Invitation } from './entities/invitation.entity';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { TeamMember } from '../teams/entities/team-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, User, Team, Player, TeamMember]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
