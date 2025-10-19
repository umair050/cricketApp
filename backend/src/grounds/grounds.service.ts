import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import { Ground, GroundStatus } from './entities/ground.entity';
import { GroundSlot } from './entities/ground-slot.entity';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreateGroundDto } from './dto/create-ground.dto';
import { UpdateGroundDto } from './dto/update-ground.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SearchGroundsDto } from './dto/search-grounds.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class GroundsService {
  constructor(
    @InjectRepository(Ground)
    private groundsRepository: Repository<Ground>,
    @InjectRepository(GroundSlot)
    private slotsRepository: Repository<GroundSlot>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  // ==================== GROUND MANAGEMENT ====================

  async createGround(createGroundDto: CreateGroundDto, ownerId: number): Promise<Ground> {
    const ground = this.groundsRepository.create({
      ...createGroundDto,
      owner: { id: ownerId },
      status: GroundStatus.PENDING,
    });
    return this.groundsRepository.save(ground);
  }

  async findAllGrounds(searchDto?: SearchGroundsDto): Promise<{ grounds: Ground[]; total: number; page: number; totalPages: number }> {
    const page = searchDto?.page || 1;
    const limit = searchDto?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.groundsRepository
      .createQueryBuilder('ground')
      .leftJoinAndSelect('ground.owner', 'owner')
      .where('ground.isActive = :isActive', { isActive: true })
      .andWhere('ground.status = :status', { status: GroundStatus.APPROVED });

    // Apply filters
    if (searchDto?.city && searchDto.city.trim()) {
      queryBuilder.andWhere('LOWER(ground.city) = LOWER(:city)', { city: searchDto.city });
    }

    if (searchDto?.state && searchDto.state.trim()) {
      queryBuilder.andWhere('LOWER(ground.state) = LOWER(:state)', { state: searchDto.state });
    }

    if (searchDto?.pitchType && searchDto.pitchType.trim()) {
      queryBuilder.andWhere('ground.pitchType = :pitchType', { pitchType: searchDto.pitchType });
    }

    if (searchDto?.minPrice !== undefined) {
      queryBuilder.andWhere('ground.hourlyRate >= :minPrice', { minPrice: searchDto.minPrice });
    }

    if (searchDto?.maxPrice !== undefined) {
      queryBuilder.andWhere('ground.hourlyRate <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    if (searchDto?.minRating !== undefined) {
      queryBuilder.andWhere('ground.rating >= :minRating', { minRating: searchDto.minRating });
    }

    if (searchDto?.search && searchDto.search.trim()) {
      queryBuilder.andWhere(
        '(LOWER(ground.name) LIKE LOWER(:search) OR LOWER(ground.description) LIKE LOWER(:search))',
        { search: `%${searchDto.search}%` }
      );
    }

    queryBuilder.orderBy('ground.rating', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [grounds, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      grounds,
      total,
      page,
      totalPages,
    };
  }

  async findGroundById(id: string): Promise<Ground> {
    const ground = await this.groundsRepository.findOne({
      where: { id, isActive: true },
      relations: ['owner'],
    });

    if (!ground) {
      throw new NotFoundException(`Ground with ID ${id} not found`);
    }

    return ground;
  }

  async findGroundsByOwner(ownerId: number): Promise<Ground[]> {
    return this.groundsRepository.find({
      where: { owner: { id: ownerId }, isActive: true },
      relations: ['owner'],
    });
  }

  async updateGround(id: string, updateGroundDto: UpdateGroundDto, userId: number): Promise<Ground> {
    const ground = await this.findGroundById(id);

    if (ground.owner.id !== userId) {
      throw new ForbiddenException('You are not authorized to update this ground');
    }

    await this.groundsRepository.update(id, updateGroundDto);
    return this.findGroundById(id);
  }

  async deleteGround(id: string, userId: number): Promise<void> {
    const ground = await this.findGroundById(id);

    if (ground.owner.id !== userId) {
      throw new ForbiddenException('You are not authorized to delete this ground');
    }

    await this.groundsRepository.update(id, { isActive: false });
  }

  async approveGround(id: string): Promise<Ground> {
    await this.groundsRepository.update(id, { status: GroundStatus.APPROVED });
    return this.findGroundById(id);
  }

  async rejectGround(id: string): Promise<Ground> {
    await this.groundsRepository.update(id, { status: GroundStatus.REJECTED });
    return this.findGroundById(id);
  }

  // ==================== SLOT MANAGEMENT ====================

  async checkAvailability(checkDto: CheckAvailabilityDto): Promise<{ available: boolean; slots: GroundSlot[] }> {
    const { groundId, date, startTime, endTime } = checkDto;

    const ground = await this.findGroundById(groundId);

    // Check if the time is within ground operating hours (skip for 24-hour grounds)
    if (!(ground.openTime === '00:00:00' && ground.closeTime === '23:59:59')) {
      if (startTime < ground.openTime || endTime > ground.closeTime) {
        throw new BadRequestException('Selected time is outside ground operating hours');
      }
    }

    // Convert date string to Date object for proper comparison
    const dateObj = new Date(date);
    const dateStr = dateObj.toISOString().split('T')[0];

    // Get all booked/blocked slots for this ground and date
    const allSlots = await this.slotsRepository
      .createQueryBuilder('slot')
      .where('slot.groundId = :groundId', { groundId })
      .andWhere('DATE(slot.date) = :date', { date: dateStr })
      .andWhere('(slot.isBooked = :isBooked OR slot.isBlocked = :isBlocked)', { isBooked: true, isBlocked: true })
      .getMany();

    // Filter for actual overlaps using proper time comparison
    const conflictingSlots = allSlots.filter(slot => {
      // Two time ranges overlap if: start1 < end2 AND end1 > start2
      // For adjacent slots (06:00-07:00 and 07:00-08:00), this returns false (correct)
      const hasOverlap = slot.startTime < endTime && slot.endTime > startTime;
      
      console.log('Checking slot:', {
        slotTime: `${slot.startTime}-${slot.endTime}`,
        requestedTime: `${startTime}-${endTime}`,
        slotStartLessThanRequestedEnd: slot.startTime < endTime,
        slotEndGreaterThanRequestedStart: slot.endTime > startTime,
        hasOverlap,
      });
      
      return hasOverlap;
    });

    console.log('Availability Check Summary:', {
      requested: { date: dateStr, startTime, endTime },
      totalSlots: allSlots.length,
      conflictingSlots: conflictingSlots.length,
      available: conflictingSlots.length === 0,
    });

    return {
      available: conflictingSlots.length === 0,
      slots: conflictingSlots,
    };
  }

  async getGroundAvailability(groundId: string, date: string): Promise<GroundSlot[]> {
    await this.findGroundById(groundId); // Validate ground exists

    return this.slotsRepository.find({
      where: { ground: { id: groundId }, date: new Date(date) },
      order: { startTime: 'ASC' },
    });
  }

  async blockSlots(groundId: string, date: string, startTime: string, endTime: string, userId: number): Promise<GroundSlot> {
    const ground = await this.findGroundById(groundId);

    if (ground.owner.id !== userId) {
      throw new ForbiddenException('You are not authorized to block slots for this ground');
    }

    const slot = this.slotsRepository.create({
      ground: { id: groundId },
      date: new Date(date),
      startTime,
      endTime,
      isBlocked: true,
    });

    return this.slotsRepository.save(slot);
  }

  // ==================== BOOKING MANAGEMENT ====================

  async createBooking(createBookingDto: CreateBookingDto, userId: number): Promise<Booking> {
    const { groundId, startDatetime, endDatetime, totalAmount, slotType, purpose, notes } = createBookingDto;

    const ground = await this.findGroundById(groundId);

    // Extract date and time from datetime (KEEP IN UTC)
    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);
    
    // Extract UTC time components
    const startTimeUTC = startDate.toISOString().split('T')[1].substring(0, 8); // HH:MM:SS
    const endTimeUTC = endDate.toISOString().split('T')[1].substring(0, 8);
    const dateUTC = startDate.toISOString().split('T')[0];

    // Check availability
    const availability = await this.checkAvailability({
      groundId,
      date: dateUTC,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    });

    if (!availability.available) {
      throw new BadRequestException('Selected time slot is not available');
    }

    // Calculate platform fee (e.g., 10% of total amount)
    const platformFee = totalAmount * 0.1;

    // Create booking
    const booking = this.bookingsRepository.create({
      user: { id: userId },
      ground: { id: groundId },
      slotType,
      startDatetime: new Date(startDatetime),
      endDatetime: new Date(endDatetime),
      totalAmount,
      platformFee,
      purpose,
      notes,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    // Create slot entries
    await this.createSlotEntries(groundId, startDate, endDate, savedBooking.id);

    return this.findBookingById(savedBooking.id);
  }

  private async createSlotEntries(groundId: string, startDate: Date, endDate: Date, bookingId: string): Promise<void> {
    const slots: GroundSlot[] = [];
    
    // For hourly bookings, create slot for each hour
    const currentTime = new Date(startDate);
    
    while (currentTime < endDate) {
      const nextTime = new Date(currentTime);
      nextTime.setHours(currentTime.getHours() + 1);
      
      // Don't go beyond endDate
      const slotEnd = nextTime > endDate ? endDate : nextTime;
      
      // Extract UTC components
      const dateUTC = currentTime.toISOString().split('T')[0];
      const startTimeUTC = currentTime.toISOString().split('T')[1].substring(0, 8);
      const endTimeUTC = slotEnd.toISOString().split('T')[1].substring(0, 8);

      const slot = this.slotsRepository.create({
        ground: { id: groundId },
        date: new Date(dateUTC),
        startTime: startTimeUTC,
        endTime: endTimeUTC,
        isBooked: true,
        booking: { id: bookingId },
      });
      slots.push(slot);
      
      currentTime.setHours(currentTime.getHours() + 1);
    }

    console.log('Creating slots:', slots.map(s => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    })));

    await this.slotsRepository.save(slots);
  }

  async findBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'ground', 'ground.owner', 'payment'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['ground', 'ground.owner', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findGroundBookings(groundId: string, userId: number): Promise<Booking[]> {
    const ground = await this.findGroundById(groundId);

    if (ground.owner.id !== userId) {
      throw new ForbiddenException('You are not authorized to view bookings for this ground');
    }

    return this.bookingsRepository.find({
      where: { ground: { id: groundId } },
      relations: ['user', 'ground', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  // Public endpoint to get booked time slots (without user details)
  async getBookedSlots(groundId: string, startDate?: string, endDate?: string) {
    const ground = await this.findGroundById(groundId);

    const queryBuilder = this.slotsRepository
      .createQueryBuilder('slot')
      .where('slot.groundId = :groundId', { groundId })
      .andWhere('(slot.isBooked = :isBooked OR slot.isBlocked = :isBlocked)', { 
        isBooked: true, 
        isBlocked: true 
      });

    if (startDate) {
      queryBuilder.andWhere('slot.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('slot.date <= :endDate', { endDate });
    }

    const slots = await queryBuilder
      .select(['slot.id', 'slot.date', 'slot.startTime', 'slot.endTime', 'slot.isBooked', 'slot.isBlocked'])
      .orderBy('slot.date', 'ASC')
      .addOrderBy('slot.startTime', 'ASC')
      .getMany();

    return {
      groundId,
      groundName: ground.name,
      slots: slots.map(slot => ({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.isBooked,
        isBlocked: slot.isBlocked,
      })),
    };
  }

  async updateBooking(id: string, updateBookingDto: UpdateBookingDto, userId: number): Promise<Booking> {
    const booking = await this.findBookingById(id);

    // Users can cancel their own bookings
    // Ground owners can approve/reject bookings
    const isOwner = booking.ground.owner.id === userId;
    const isBookingUser = booking.user.id === userId;

    if (!isOwner && !isBookingUser) {
      throw new ForbiddenException('You are not authorized to update this booking');
    }

    const updateData: any = { ...updateBookingDto };

    if (updateBookingDto.status === BookingStatus.CONFIRMED) {
      updateData.confirmedAt = new Date();
    } else if (updateBookingDto.status === BookingStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
      // Release the slots
      await this.slotsRepository.update(
        { booking: { id } },
        { isBooked: false, booking: null }
      );
    }

    await this.bookingsRepository.update(id, updateData);
    return this.findBookingById(id);
  }

  async cancelBooking(id: string, userId: number, reason?: string): Promise<Booking> {
    return this.updateBooking(id, {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason,
    }, userId);
  }

  // ==================== PAYMENT MANAGEMENT ====================

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { bookingId, amount, method, transactionId, paymentGateway } = createPaymentDto;

    const booking = await this.findBookingById(bookingId);

    const payment = this.paymentsRepository.create({
      booking: { id: bookingId },
      amount,
      method,
      transactionId,
      paymentGateway,
      status: PaymentStatus.PENDING,
    });

    return this.paymentsRepository.save(payment);
  }

  async confirmPayment(paymentId: string, transactionId: string, gatewayResponse?: any): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    await this.paymentsRepository.update(paymentId, {
      status: PaymentStatus.SUCCESS,
      transactionId,
      gatewayResponse,
    });

    // Update booking status
    await this.bookingsRepository.update(payment.booking.id, {
      isPaid: true,
      status: BookingStatus.CONFIRMED,
      confirmedAt: new Date(),
    });

    // Update ground stats
    await this.groundsRepository.increment(
      { id: payment.booking.ground.id },
      'totalBookings',
      1
    );

    return this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking', 'booking.ground', 'booking.user'],
    });
  }

  async failPayment(paymentId: string, reason?: string): Promise<Payment> {
    await this.paymentsRepository.update(paymentId, {
      status: PaymentStatus.FAILED,
    });

    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });

    // Cancel the booking if payment failed
    await this.bookingsRepository.update(payment.booking.id, {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason || 'Payment failed',
    });

    // Release slots
    await this.slotsRepository.update(
      { booking: { id: payment.booking.id } },
      { isBooked: false, booking: null }
    );

    return payment;
  }

  async refundPayment(paymentId: string, refundAmount: number, reason: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Can only refund successful payments');
    }

    const status = refundAmount >= payment.amount 
      ? PaymentStatus.REFUNDED 
      : PaymentStatus.PARTIALLY_REFUNDED;

    await this.paymentsRepository.update(paymentId, {
      status,
      refundAmount,
      refundReason: reason,
      refundedAt: new Date(),
    });

    // Cancel the booking
    await this.bookingsRepository.update(payment.booking.id, {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason,
      cancelledAt: new Date(),
    });

    // Release slots
    await this.slotsRepository.update(
      { booking: { id: payment.booking.id } },
      { isBooked: false, booking: null }
    );

    return this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });
  }

  // ==================== STATS & ANALYTICS ====================

  async getGroundStats(groundId: string, userId: number): Promise<any> {
    const ground = await this.findGroundById(groundId);

    if (ground.owner.id !== userId) {
      throw new ForbiddenException('You are not authorized to view stats for this ground');
    }

    const totalBookings = await this.bookingsRepository.count({
      where: { ground: { id: groundId } },
    });

    const completedBookings = await this.bookingsRepository.count({
      where: { ground: { id: groundId }, status: BookingStatus.COMPLETED },
    });

    const totalRevenue = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'total')
      .where('booking.groundId = :groundId', { groundId })
      .andWhere('booking.isPaid = :isPaid', { isPaid: true })
      .getRawOne();

    const upcomingBookings = await this.bookingsRepository.count({
      where: { 
        ground: { id: groundId },
        status: BookingStatus.CONFIRMED,
        startDatetime: MoreThanOrEqual(new Date()),
      },
    });

    return {
      groundId,
      totalBookings,
      completedBookings,
      upcomingBookings,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      rating: ground.rating,
      reviewCount: ground.reviewCount,
    };
  }
}

