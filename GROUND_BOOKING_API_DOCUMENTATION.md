# 🏟️ Ground Booking Marketplace API Documentation

## Overview

Complete REST API for a cricket ground booking marketplace where ground owners can list their grounds and users can browse, book, and manage their bookings.

---

## 📊 Database Schema

### Entities Created

1. **Ground** - Cricket ground listings
2. **GroundSlot** - Time slot management
3. **Booking** - Booking records
4. **Payment** - Payment transactions

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:3000/api/grounds
```

---

## 1️⃣ Ground Management

### 1.1 Create Ground
**Endpoint:** `POST /grounds`  
**Auth:** Required (JWT)  
**Description:** Ground owners can list their cricket grounds

**Request Body:**
```json
{
  "name": "MCG Cricket Ground",
  "description": "Professional cricket ground with excellent facilities",
  "address": "123 Cricket Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "pitchType": "turf",
  "hourlyRate": 5000,
  "dailyRate": 40000,
  "openTime": "06:00:00",
  "closeTime": "22:00:00",
  "amenities": {
    "lighting": true,
    "dressingRoom": true,
    "parking": true,
    "waterSupply": true,
    "firstAid": true,
    "cafeteria": false,
    "scoreboard": true,
    "seatingCapacity": 500
  },
  "images": [
    "https://example.com/ground1.jpg",
    "https://example.com/ground2.jpg"
  ],
  "capacity": 50,
  "size": 10000
}
```

**Pitch Types:**
- `turf` - Natural grass
- `cement` - Cement pitch
- `matting` - Matting over concrete
- `astro_turf` - Artificial turf

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "MCG Cricket Ground",
  "status": "pending",
  "owner": { "id": 1, "name": "John Doe" },
  "createdAt": "2025-10-18T10:00:00Z"
}
```

---

### 1.2 Get All Grounds (with Filters)
**Endpoint:** `GET /grounds`  
**Auth:** Not Required  
**Description:** Browse all approved grounds with advanced filtering

**Query Parameters:**
- `city` (string) - Filter by city
- `state` (string) - Filter by state
- `pitchType` (enum) - Filter by pitch type
- `minPrice` (number) - Minimum hourly rate
- `maxPrice` (number) - Maximum hourly rate
- `date` (string) - Check availability on specific date (YYYY-MM-DD)
- `minRating` (number) - Minimum rating (0-5)
- `search` (string) - Search in name/description
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)

**Example Request:**
```
GET /grounds?city=Mumbai&minRating=4&page=1&limit=20
```

**Response:** `200 OK`
```json
{
  "grounds": [
    {
      "id": "uuid",
      "name": "MCG Cricket Ground",
      "city": "Mumbai",
      "hourlyRate": 5000,
      "dailyRate": 40000,
      "rating": 4.5,
      "reviewCount": 125,
      "amenities": {...},
      "images": [...]
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

---

### 1.3 Get Ground by ID
**Endpoint:** `GET /grounds/:id`  
**Auth:** Not Required  
**Description:** Get detailed information about a specific ground

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "MCG Cricket Ground",
  "description": "Professional cricket ground...",
  "address": "123 Cricket Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pitchType": "turf",
  "hourlyRate": 5000,
  "dailyRate": 40000,
  "openTime": "06:00:00",
  "closeTime": "22:00:00",
  "amenities": {...},
  "images": [...],
  "rating": 4.5,
  "reviewCount": 125,
  "totalBookings": 350,
  "owner": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 1.4 Get My Grounds
**Endpoint:** `GET /grounds/owner/my-grounds`  
**Auth:** Required (JWT)  
**Description:** Get all grounds owned by current user

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "MCG Cricket Ground",
    "status": "approved",
    "totalBookings": 350,
    "rating": 4.5
  }
]
```

---

### 1.5 Update Ground
**Endpoint:** `PATCH /grounds/:id`  
**Auth:** Required (JWT, Owner only)  
**Description:** Update ground details

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Ground Name",
  "hourlyRate": 5500,
  "dailyRate": 45000
}
```

**Response:** `200 OK`

---

### 1.6 Delete Ground
**Endpoint:** `DELETE /grounds/:id`  
**Auth:** Required (JWT, Owner only)  
**Description:** Soft delete a ground (sets isActive to false)

**Response:** `204 No Content`

---

### 1.7 Approve Ground (Admin)
**Endpoint:** `PATCH /grounds/:id/approve`  
**Auth:** Required (JWT, Admin only)  
**Description:** Approve a pending ground listing

**Response:** `200 OK`

---

### 1.8 Reject Ground (Admin)
**Endpoint:** `PATCH /grounds/:id/reject`  
**Auth:** Required (JWT, Admin only)  
**Description:** Reject a pending ground listing

**Response:** `200 OK`

---

## 2️⃣ Availability & Slot Management

### 2.1 Check Availability
**Endpoint:** `POST /grounds/availability/check`  
**Auth:** Not Required  
**Description:** Check if a specific time slot is available

**Request Body:**
```json
{
  "groundId": "uuid",
  "date": "2025-10-25",
  "startTime": "10:00:00",
  "endTime": "12:00:00"
}
```

**Response:** `200 OK`
```json
{
  "available": true,
  "slots": []
}
```

**If not available:**
```json
{
  "available": false,
  "slots": [
    {
      "id": "uuid",
      "date": "2025-10-25",
      "startTime": "10:00:00",
      "endTime": "12:00:00",
      "isBooked": true
    }
  ]
}
```

---

### 2.2 Get Ground Availability
**Endpoint:** `GET /grounds/:id/availability?date=YYYY-MM-DD`  
**Auth:** Not Required  
**Description:** Get all slots for a ground on a specific date

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "isBooked": true,
    "isBlocked": false
  },
  {
    "id": "uuid",
    "startTime": "14:00:00",
    "endTime": "16:00:00",
    "isBooked": false,
    "isBlocked": false
  }
]
```

---

### 2.3 Block Slots
**Endpoint:** `POST /grounds/:id/block-slots`  
**Auth:** Required (JWT, Owner only)  
**Description:** Block time slots for maintenance or other reasons

**Request Body:**
```json
{
  "date": "2025-10-25",
  "startTime": "10:00:00",
  "endTime": "14:00:00"
}
```

**Response:** `201 Created`

---

## 3️⃣ Booking Management

### 3.1 Create Booking
**Endpoint:** `POST /grounds/bookings`  
**Auth:** Required (JWT)  
**Description:** Book a ground for specific time slots

**Request Body:**
```json
{
  "groundId": "uuid",
  "slotType": "hourly",
  "startDatetime": "2025-10-25T10:00:00Z",
  "endDatetime": "2025-10-25T12:00:00Z",
  "totalAmount": 10000,
  "purpose": "practice",
  "notes": "Need equipment as well"
}
```

**Slot Types:**
- `hourly` - Book by hour
- `daily` - Full day booking
- `multi_day` - Multiple days

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user": { "id": 1, "name": "John Doe" },
  "ground": { "id": "uuid", "name": "MCG Cricket Ground" },
  "slotType": "hourly",
  "startDatetime": "2025-10-25T10:00:00Z",
  "endDatetime": "2025-10-25T12:00:00Z",
  "totalAmount": 10000,
  "platformFee": 1000,
  "status": "pending",
  "isPaid": false,
  "createdAt": "2025-10-18T10:00:00Z"
}
```

---

### 3.2 Get Booking by ID
**Endpoint:** `GET /grounds/bookings/:id`  
**Auth:** Required (JWT)  
**Description:** Get booking details

**Response:** `200 OK`

---

### 3.3 Get My Bookings
**Endpoint:** `GET /grounds/bookings/user/my-bookings`  
**Auth:** Required (JWT)  
**Description:** Get all bookings made by current user

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "ground": { "name": "MCG Cricket Ground", "city": "Mumbai" },
    "slotType": "hourly",
    "startDatetime": "2025-10-25T10:00:00Z",
    "endDatetime": "2025-10-25T12:00:00Z",
    "status": "confirmed",
    "isPaid": true,
    "totalAmount": 10000
  }
]
```

---

### 3.4 Get Ground Bookings
**Endpoint:** `GET /grounds/:id/bookings`  
**Auth:** Required (JWT, Owner only)  
**Description:** Get all bookings for a specific ground

**Response:** `200 OK`

---

### 3.5 Update Booking Status
**Endpoint:** `PATCH /grounds/bookings/:id`  
**Auth:** Required (JWT)  
**Description:** Update booking status (users can cancel, owners can confirm/reject)

**Request Body:**
```json
{
  "status": "confirmed",
  "cancellationReason": "Weather conditions"
}
```

**Booking Statuses:**
- `pending` - Waiting for confirmation
- `confirmed` - Confirmed by owner
- `cancelled` - Cancelled by user/owner
- `completed` - Booking completed
- `rejected` - Rejected by owner

**Response:** `200 OK`

---

### 3.6 Cancel Booking
**Endpoint:** `POST /grounds/bookings/:id/cancel`  
**Auth:** Required (JWT)  
**Description:** Cancel a booking

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

**Response:** `200 OK`

---

## 4️⃣ Payment Management

### 4.1 Create Payment
**Endpoint:** `POST /grounds/payments`  
**Auth:** Required (JWT)  
**Description:** Initiate payment for a booking

**Request Body:**
```json
{
  "bookingId": "uuid",
  "amount": 10000,
  "method": "card",
  "paymentGateway": "stripe"
}
```

**Payment Methods:**
- `card` - Credit/Debit card
- `upi` - UPI payment
- `net_banking` - Net banking
- `wallet` - Digital wallet
- `cash` - Cash on site

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "booking": {...},
  "amount": 10000,
  "method": "card",
  "status": "pending",
  "createdAt": "2025-10-18T10:00:00Z"
}
```

---

### 4.2 Confirm Payment
**Endpoint:** `POST /grounds/payments/:id/confirm`  
**Auth:** Required (JWT)  
**Description:** Confirm successful payment (usually called by payment gateway webhook)

**Request Body:**
```json
{
  "transactionId": "txn_123456789",
  "gatewayResponse": {
    "status": "success",
    "amount": 10000
  }
}
```

**Response:** `200 OK`

**Side Effects:**
- Booking status changes to `confirmed`
- `isPaid` flag set to `true`
- Ground `totalBookings` incremented

---

### 4.3 Fail Payment
**Endpoint:** `POST /grounds/payments/:id/fail`  
**Auth:** Required (JWT)  
**Description:** Mark payment as failed

**Request Body:**
```json
{
  "reason": "Insufficient funds"
}
```

**Response:** `200 OK`

**Side Effects:**
- Booking cancelled
- Slots released

---

### 4.4 Refund Payment
**Endpoint:** `POST /grounds/payments/:id/refund`  
**Auth:** Required (JWT)  
**Description:** Process refund for a payment

**Request Body:**
```json
{
  "refundAmount": 10000,
  "reason": "Ground not available"
}
```

**Response:** `200 OK`

**Side Effects:**
- Payment status changes to `refunded` or `partially_refunded`
- Booking cancelled
- Slots released

---

## 5️⃣ Statistics & Analytics

### 5.1 Get Ground Stats
**Endpoint:** `GET /grounds/:id/stats`  
**Auth:** Required (JWT, Owner only)  
**Description:** Get analytics for a ground

**Response:** `200 OK`
```json
{
  "groundId": "uuid",
  "totalBookings": 350,
  "completedBookings": 320,
  "upcomingBookings": 15,
  "totalRevenue": 1750000,
  "rating": 4.5,
  "reviewCount": 125
}
```

---

## 📝 Status Enums

### Ground Status
- `pending` - Awaiting admin approval
- `approved` - Live and bookable
- `rejected` - Rejected by admin
- `suspended` - Temporarily suspended

### Booking Status
- `pending` - Awaiting confirmation
- `confirmed` - Confirmed and paid
- `cancelled` - Cancelled
- `completed` - Booking completed
- `rejected` - Rejected by owner

### Payment Status
- `pending` - Payment initiated
- `success` - Payment successful
- `failed` - Payment failed
- `refunded` - Fully refunded
- `partially_refunded` - Partially refunded

---

## 🔒 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Selected time slot is not available",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You are not authorized to update this ground",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Ground with ID xyz not found",
  "error": "Not Found"
}
```

---

## 🎯 Typical Booking Flow

1. **User browses grounds**
   ```
   GET /grounds?city=Mumbai
   ```

2. **User views ground details**
   ```
   GET /grounds/:id
   ```

3. **User checks availability**
   ```
   POST /grounds/availability/check
   ```

4. **User creates booking**
   ```
   POST /grounds/bookings
   ```

5. **User initiates payment**
   ```
   POST /grounds/payments
   ```

6. **Payment gateway confirms payment**
   ```
   POST /grounds/payments/:id/confirm
   ```

7. **Booking confirmed!** ✅

---

## 🏗️ Database Tables Created

### `grounds`
- Ground listings with details
- Owner relationship
- Pricing, amenities, location
- Status tracking

### `ground_slots`
- Individual time slots
- Booking status
- Block status for maintenance

### `bookings`
- Booking records
- User and ground relationships
- Payment tracking
- Status management

### `payments`
- Payment transactions
- Gateway integration
- Refund handling

---

## 🚀 Next Steps

### Integration Tasks:
1. **Payment Gateway Integration**
   - Integrate Stripe/Razorpay/PayPal
   - Setup webhooks for payment confirmation
   - Handle payment failures and retries

2. **Notification System**
   - Email confirmations
   - SMS notifications
   - Push notifications

3. **Review & Rating System**
   - Add review entity
   - Rating calculation
   - Review moderation

4. **Search Optimization**
   - Full-text search
   - Geolocation-based search
   - Elasticsearch integration

5. **Admin Dashboard**
   - Ground approval workflow
   - Revenue tracking
   - Dispute management

---

## 📞 Support

For issues or questions, contact the development team.

---

**Created:** October 18, 2025  
**Version:** 1.0.0  
**Module:** Ground Booking Marketplace

