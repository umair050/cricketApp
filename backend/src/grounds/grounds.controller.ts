import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req, 
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GroundsService } from './grounds.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGroundDto } from './dto/create-ground.dto';
import { UpdateGroundDto } from './dto/update-ground.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SearchGroundsDto } from './dto/search-grounds.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Grounds')
@Controller('grounds')
export class GroundsController {
  constructor(private readonly groundsService: GroundsService) {}

  // ==================== GROUND ENDPOINTS ====================

  @ApiOperation({ summary: 'Create new ground' })
  @ApiResponse({ status: 201, description: 'Ground created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createGround(@Body() createGroundDto: CreateGroundDto, @Req() req: any) {
    return this.groundsService.createGround(createGroundDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all grounds with filters' })
  @ApiResponse({ status: 200, description: 'Grounds retrieved successfully' })
  @Get()
  findAllGrounds(@Query() searchDto: SearchGroundsDto) {
    return this.groundsService.findAllGrounds(searchDto);
  }

  @ApiOperation({ summary: 'Get grounds owned by current user' })
  @ApiResponse({ status: 200, description: 'Owner grounds retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('owner/my-grounds')
  findMyGrounds(@Req() req: any) {
    return this.groundsService.findGroundsByOwner(req.user.id);
  }

  @ApiOperation({ summary: 'Get ground by ID' })
  @ApiResponse({ status: 200, description: 'Ground retrieved successfully' })
  @Get(':id')
  findGroundById(@Param('id') id: string) {
    return this.groundsService.findGroundById(id);
  }

  @ApiOperation({ summary: 'Update ground' })
  @ApiResponse({ status: 200, description: 'Ground updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateGround(
    @Param('id') id: string,
    @Body() updateGroundDto: UpdateGroundDto,
    @Req() req: any,
  ) {
    return this.groundsService.updateGround(id, updateGroundDto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete ground' })
  @ApiResponse({ status: 204, description: 'Ground deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteGround(@Param('id') id: string, @Req() req: any) {
    return this.groundsService.deleteGround(id, req.user.id);
  }

  @ApiOperation({ summary: 'Approve ground (Admin only - temporarily open for development)' })
  @ApiResponse({ status: 200, description: 'Ground approved successfully' })
  @Patch(':id/approve')
  approveGround(@Param('id') id: string) {
    return this.groundsService.approveGround(id);
  }

  @ApiOperation({ summary: 'Reject ground (Admin only)' })
  @ApiResponse({ status: 200, description: 'Ground rejected successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  rejectGround(@Param('id') id: string) {
    return this.groundsService.rejectGround(id);
  }

  // ==================== AVAILABILITY ENDPOINTS ====================

  @ApiOperation({ summary: 'Check slot availability' })
  @ApiResponse({ status: 200, description: 'Availability checked successfully' })
  @Post('availability/check')
  checkAvailability(@Body() checkDto: CheckAvailabilityDto) {
    return this.groundsService.checkAvailability(checkDto);
  }

  @ApiOperation({ summary: 'Get ground availability for a date' })
  @ApiResponse({ status: 200, description: 'Availability retrieved successfully' })
  @Get(':id/availability')
  getGroundAvailability(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.groundsService.getGroundAvailability(id, date);
  }

  @ApiOperation({ summary: 'Get booked slots for a ground (public)' })
  @ApiResponse({ status: 200, description: 'Booked slots retrieved successfully' })
  @Get(':id/booked-slots')
  getBookedSlots(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.groundsService.getBookedSlots(id, startDate, endDate);
  }

  @ApiOperation({ summary: 'Block slots (Ground owner only)' })
  @ApiResponse({ status: 201, description: 'Slots blocked successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/block-slots')
  blockSlots(
    @Param('id') id: string,
    @Body() body: { date: string; startTime: string; endTime: string },
    @Req() req: any,
  ) {
    return this.groundsService.blockSlots(
      id,
      body.date,
      body.startTime,
      body.endTime,
      req.user.id,
    );
  }

  // ==================== BOOKING ENDPOINTS ====================

  @ApiOperation({ summary: 'Create new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    return this.groundsService.createBooking(createBookingDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'User bookings retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('bookings/user/my-bookings')
  findUserBookings(@Req() req: any) {
    return this.groundsService.findUserBookings(req.user.id);
  }

  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('bookings/:id')
  findBookingById(@Param('id') id: string) {
    return this.groundsService.findBookingById(id);
  }

  @ApiOperation({ summary: 'Get bookings for a ground (Owner only)' })
  @ApiResponse({ status: 200, description: 'Ground bookings retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/bookings')
  findGroundBookings(@Param('id') id: string, @Req() req: any) {
    return this.groundsService.findGroundBookings(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('bookings/:id')
  updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: any,
  ) {
    return this.groundsService.updateBooking(id, updateBookingDto, req.user.id);
  }

  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('bookings/:id/cancel')
  cancelBooking(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Req() req: any,
  ) {
    return this.groundsService.cancelBooking(id, req.user.id, body.reason);
  }

  // ==================== PAYMENT ENDPOINTS ====================

  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payments')
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.groundsService.createPayment(createPaymentDto);
  }

  @ApiOperation({ summary: 'Confirm payment' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payments/:id/confirm')
  confirmPayment(
    @Param('id') id: string,
    @Body() body: { transactionId: string; gatewayResponse?: any },
  ) {
    return this.groundsService.confirmPayment(
      id,
      body.transactionId,
      body.gatewayResponse,
    );
  }

  @ApiOperation({ summary: 'Mark payment as failed' })
  @ApiResponse({ status: 200, description: 'Payment marked as failed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payments/:id/fail')
  failPayment(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.groundsService.failPayment(id, body.reason);
  }

  @ApiOperation({ summary: 'Refund payment' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payments/:id/refund')
  refundPayment(
    @Param('id') id: string,
    @Body() body: { refundAmount: number; reason: string },
  ) {
    return this.groundsService.refundPayment(id, body.refundAmount, body.reason);
  }

  // ==================== STATS ENDPOINTS ====================

  @ApiOperation({ summary: 'Get ground statistics (Owner only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  getGroundStats(@Param('id') id: string, @Req() req: any) {
    return this.groundsService.getGroundStats(id, req.user.id);
  }
}

