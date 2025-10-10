import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InvitationStatus } from '../entities/invitation.entity';

export class UpdateInvitationDto {
  @IsEnum(InvitationStatus)
  @IsOptional()
  status?: InvitationStatus;

  @IsOptional()
  @IsString()
  message?: string;
}
