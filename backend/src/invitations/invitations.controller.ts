import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InvitationStatus } from './entities/invitation.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('invitations')
@UseGuards(JwtAuthGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInvitation(
    @Body() createInvitationDto: CreateInvitationDto,
    @Request() req: any,
  ) {
    return this.invitationsService.createInvitation(createInvitationDto, req.user.id);
  }

  @Get()
  async getInvitations(@Request() req: any) {
    return this.invitationsService.getInvitations(req.user.id);
  }

  @Patch(':id/accept')
  async acceptInvitation(@Param('id') id: string, @Request() req: any) {
    return this.invitationsService.acceptInvitation(parseInt(id), req.user.id);
  }

  @Patch(':id/reject')
  async rejectInvitation(@Param('id') id: string, @Request() req: any) {
    return this.invitationsService.rejectInvitation(parseInt(id), req.user.id);
  }

  @Patch(':id/cancel')
  async cancelInvitation(@Param('id') id: string, @Request() req: any) {
    return this.invitationsService.cancelInvitation(parseInt(id), req.user.id);
  }

  @Patch(':id')
  async updateInvitation(
    @Param('id') id: string,
    @Body() updateInvitationDto: UpdateInvitationDto,
    @Request() req: any,
  ) {
    if (updateInvitationDto.status) {
      return this.invitationsService.updateInvitationStatus(parseInt(id), updateInvitationDto.status, req.user.id);
    }
    // Handle other updates if needed
    throw new Error('Only status updates are currently supported');
  }
}
