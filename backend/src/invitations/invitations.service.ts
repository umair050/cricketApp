import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, InvitationType, InvitationStatus } from './entities/invitation.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { TeamMember, TeamMemberRole } from '../teams/entities/team-member.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  async createInvitation(
    createInvitationDto: CreateInvitationDto,
    senderId: number,
  ): Promise<Invitation> {
    const { receiverId, type, entityId, message } = createInvitationDto;

    // Validate sender and receiver
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send invitation to yourself');
    }

    // Validate invitation type specific rules
    await this.validateInvitationRules(senderId, receiverId, type, entityId);

    // Check for existing pending invitations
    const existingInvitation = await this.invitationRepository.findOne({
      where: [
        { senderId, receiverId, type, status: InvitationStatus.PENDING },
        { senderId: receiverId, receiverId: senderId, type, status: InvitationStatus.PENDING },
      ],
    });

    if (existingInvitation) {
      throw new ConflictException('Pending invitation already exists');
    }

    // Create invitation
    const invitation = this.invitationRepository.create({
      senderId,
      receiverId,
      type,
      entityId,
      message,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return this.invitationRepository.save(invitation);
  }

  async getInvitations(userId: number): Promise<{
    sent: Invitation[];
    received: Invitation[];
  }> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const sent = await this.invitationRepository.find({
      where: { senderId: userId },
      relations: ['receiver', 'team'],
      order: { createdAt: 'DESC' },
    });

    const received = await this.invitationRepository.find({
      where: { receiverId: userId },
      relations: ['sender', 'team'],
      order: { createdAt: 'DESC' },
    });

    return { sent, received };
  }

  async updateInvitationStatus(
    invitationId: number,
    status: InvitationStatus,
    userId: number,
  ): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ['sender', 'receiver', 'team'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Check permissions
    if (status === InvitationStatus.CANCELLED) {
      if (invitation.senderId !== userId) {
        throw new ForbiddenException('Only sender can cancel invitation');
      }
    } else if (status === InvitationStatus.ACCEPTED || status === InvitationStatus.REJECTED) {
      if (invitation.receiverId !== userId) {
        throw new ForbiddenException('Only receiver can accept/reject invitation');
      }
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation is no longer pending');
    }

    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      invitation.status = InvitationStatus.EXPIRED;
      return this.invitationRepository.save(invitation);
    }

    // Update status
    invitation.status = status;
    const updatedInvitation = await this.invitationRepository.save(invitation);

    // Handle acceptance
    if (status === InvitationStatus.ACCEPTED) {
      await this.handleInvitationAcceptance(updatedInvitation);
    }

    return updatedInvitation;
  }

  async cancelInvitation(invitationId: number, userId: number): Promise<Invitation> {
    return this.updateInvitationStatus(invitationId, InvitationStatus.CANCELLED, userId);
  }

  async acceptInvitation(invitationId: number, userId: number): Promise<Invitation> {
    return this.updateInvitationStatus(invitationId, InvitationStatus.ACCEPTED, userId);
  }

  async rejectInvitation(invitationId: number, userId: number): Promise<Invitation> {
    return this.updateInvitationStatus(invitationId, InvitationStatus.REJECTED, userId);
  }

  private async validateInvitationRules(
    senderId: number,
    receiverId: number,
    type: InvitationType,
    entityId?: number,
  ): Promise<void> {
    switch (type) {
      case InvitationType.FRIEND:
        await this.validateFriendInvitation(senderId, receiverId);
        break;
      case InvitationType.TEAM:
        await this.validateTeamInvitation(senderId, receiverId, entityId);
        break;
      case InvitationType.GROUP:
        await this.validateGroupInvitation(senderId, receiverId, entityId);
        break;
      case InvitationType.TOURNAMENT:
        await this.validateTournamentInvitation(senderId, receiverId, entityId);
        break;
    }
  }

  private async validateFriendInvitation(senderId: number, receiverId: number): Promise<void> {
    // Check if already friends
    const existingFriendship = await this.invitationRepository.findOne({
      where: [
        { senderId, receiverId, type: InvitationType.FRIEND, status: InvitationStatus.ACCEPTED },
        { senderId: receiverId, receiverId: senderId, type: InvitationType.FRIEND, status: InvitationStatus.ACCEPTED },
      ],
    });

    if (existingFriendship) {
      throw new ConflictException('Users are already friends');
    }
  }

  private async validateTeamInvitation(
    senderId: number,
    receiverId: number,
    teamId?: number,
  ): Promise<void> {
    if (!teamId) {
      throw new BadRequestException('Team ID is required for team invitations');
    }

    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if sender is team captain or manager
    const senderMembership = await this.teamMemberRepository.findOne({
      where: { teamId: teamId, userId: senderId, role: TeamMemberRole.CAPTAIN },
    });

    if (!senderMembership) {
      throw new ForbiddenException('Only team captains can send invitations');
    }

    // Check if users are friends
    const friendship = await this.invitationRepository.findOne({
      where: [
        { senderId, receiverId, type: InvitationType.FRIEND, status: InvitationStatus.ACCEPTED },
        { senderId: receiverId, receiverId: senderId, type: InvitationType.FRIEND, status: InvitationStatus.ACCEPTED },
      ],
    });

    if (!friendship) {
      throw new BadRequestException('Must be friends to invite to team');
    }

    // Check if receiver is already in team
    const existingMembership = await this.teamMemberRepository.findOne({
      where: { teamId: teamId, userId: receiverId },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a team member');
    }

    // Check team capacity (assuming max 20 members per team)
    const memberCount = await this.teamMemberRepository.count({ where: { teamId: teamId } });
    if (memberCount >= 20) {
      throw new BadRequestException('Team is at maximum capacity (20 members)');
    }

    // Check if user is in too many teams (max 3)
    const userTeamCount = await this.teamMemberRepository.count({ where: { userId: receiverId } });
    if (userTeamCount >= 3) {
      throw new BadRequestException('User is already in maximum number of teams (3)');
    }
  }

  private async validateGroupInvitation(
    senderId: number,
    receiverId: number,
    groupId?: number,
  ): Promise<void> {
    if (!groupId) {
      throw new BadRequestException('Group ID is required for group invitations');
    }

    // Check if users are friends
    const friendship = await this.invitationRepository.findOne({
      where: [
        { senderId, receiverId, type: InvitationType.FRIEND, status: InvitationStatus.ACCEPTED },
        { senderId: receiverId, receiverId: senderId, type: InvitationType.FRIEND, status: InvitationStatus.ACCEPTED },
      ],
    });

    if (!friendship) {
      throw new BadRequestException('Must be friends to invite to group');
    }

    // TODO: Implement group validation when group entity is created
  }

  private async validateTournamentInvitation(
    senderId: number,
    receiverId: number,
    tournamentId?: number,
  ): Promise<void> {
    if (!tournamentId) {
      throw new BadRequestException('Tournament ID is required for tournament invitations');
    }

    // TODO: Implement tournament validation when tournament entity is created
  }

  private async handleInvitationAcceptance(invitation: Invitation): Promise<void> {
    switch (invitation.type) {
      case InvitationType.FRIEND:
        // Create reverse friendship
        const reverseFriendship = this.invitationRepository.create({
          senderId: invitation.receiverId,
          receiverId: invitation.senderId,
          type: InvitationType.FRIEND,
          status: InvitationStatus.ACCEPTED,
        });
        await this.invitationRepository.save(reverseFriendship);
        break;

      case InvitationType.TEAM:
        // Add user to team
        const teamMember = this.teamMemberRepository.create({
          teamId: invitation.entityId,
          userId: invitation.receiverId,
          role: TeamMemberRole.MEMBER,
          joinedAt: new Date(),
        });
        await this.teamMemberRepository.save(teamMember);
        break;

      case InvitationType.GROUP:
        // TODO: Add user to group when group entity is implemented
        break;

      case InvitationType.TOURNAMENT:
        // TODO: Add team to tournament when tournament entity is implemented
        break;
    }
  }
}
