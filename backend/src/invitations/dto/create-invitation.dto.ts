import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { InvitationType } from '../entities/invitation.entity';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsEnum(InvitationType)
  @IsNotEmpty()
  type: InvitationType;

  @IsOptional()
  @IsNumber()
  entityId?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
