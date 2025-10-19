import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroundsService } from './grounds.service';
import { GroundsController } from './grounds.controller';
import { Ground } from './entities/ground.entity';
import { GroundSlot } from './entities/ground-slot.entity';
import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ground,
      GroundSlot,
      Booking,
      Payment,
      User,
    ]),
  ],
  controllers: [GroundsController],
  providers: [GroundsService],
  exports: [GroundsService],
})
export class GroundsModule {}

