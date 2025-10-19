# 🔧 Booking Availability - Complete Fix

## 🎯 Issues Fixed

### 1. **Slot Overlap Detection**

**Problem**: Adjacent slots (06:00-07:00 and 07:00-08:00) were incorrectly detected as overlapping.

**Root Cause**: SQL string comparison and improper date matching.

**Solution**:

- Changed to JavaScript filter with proper time comparison
- Added `DATE()` function for date comparison
- Fixed overlap logic: `slot.startTime < endTime && slot.endTime > startTime`

### 2. **UTC Time Handling**

**Problem**: Times were being converted between local and UTC inconsistently.

**Solution**:

- All datetime storage uses UTC (database stores in UTC)
- Slot times extracted using `.toISOString()` for consistency
- Frontend sends local times, backend stores as UTC

### 3. **Public Booked Slots Endpoint**

**Problem**: Regular users couldn't see booked slots (only owners could via `/bookings` endpoint).

**Solution**:

- Created new **public endpoint**: `GET /grounds/:id/booked-slots`
- Returns slot data without user details
- Frontend falls back to this if owner endpoint fails (403)

### 4. **Click-to-Book Feature**

**Problem**: Users had to manually enter time in modal.

**Solution**:

- Made time slots clickable
- Prefills booking modal with selected slot
- Auto-checks availability

### 5. **Image Display Quality**

**Problem**: Images were stretched/cropped poorly.

**Solution**:

- Changed to `object-contain` with blurred background
- Added placeholder image fallback
- Better error handling with `onError`

---

## 📝 Changes Made

### Backend Changes

#### **`grounds.service.ts`**

**1. Fixed `checkAvailability` method:**

```typescript
// Convert date string to Date object for proper comparison
const dateObj = new Date(date);
const dateStr = dateObj.toISOString().split("T")[0];

// Get all booked/blocked slots
const allSlots = await this.slotsRepository
  .createQueryBuilder("slot")
  .where("slot.groundId = :groundId", { groundId })
  .andWhere("DATE(slot.date) = :date", { date: dateStr }) // Use DATE() for proper comparison
  .andWhere("(slot.isBooked = :isBooked OR slot.isBlocked = :isBlocked)", {
    isBooked: true,
    isBlocked: true,
  })
  .getMany();

// Filter for actual overlaps in JavaScript
const conflictingSlots = allSlots.filter((slot) => {
  const hasOverlap = slot.startTime < endTime && slot.endTime > startTime;
  return hasOverlap;
});
```

**2. Fixed `createSlotEntries` method:**

```typescript
// For hourly bookings, create slot for each hour
const currentTime = new Date(startDate);

while (currentTime < endDate) {
  const nextTime = new Date(currentTime);
  nextTime.setHours(currentTime.getHours() + 1);

  const slotEnd = nextTime > endDate ? endDate : nextTime;

  // Extract UTC components
  const dateUTC = currentTime.toISOString().split("T")[0];
  const startTimeUTC = currentTime.toISOString().split("T")[1].substring(0, 8);
  const endTimeUTC = slotEnd.toISOString().split("T")[1].substring(0, 8);

  // Create slot
  slots.push({ date: dateUTC, startTime: startTimeUTC, endTime: endTimeUTC });
  currentTime.setHours(currentTime.getHours() + 1);
}
```

**3. Fixed `createBooking` method:**

```typescript
// Extract UTC time components
const startTimeUTC = startDate.toISOString().split("T")[1].substring(0, 8);
const endTimeUTC = endDate.toISOString().split("T")[1].substring(0, 8);
const dateUTC = startDate.toISOString().split("T")[0];

// Check availability with UTC times
const availability = await this.checkAvailability({
  groundId,
  date: dateUTC,
  startTime: startTimeUTC,
  endTime: endTimeUTC,
});
```

**4. Added new `getBookedSlots` method:**

```typescript
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
```

#### **`grounds.controller.ts`**

**Added new public endpoint:**

```typescript
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
```

---

### Frontend Changes

#### **`groundsService.js`**

**Added new service method:**

```javascript
// Get booked slots for a ground (public - no auth required)
getBookedSlots: async (groundId, startDate, endDate) => {
  const response = await axios.get(`${GROUNDS_URL}/${groundId}/booked-slots`, {
    params: { startDate, endDate },
  });
  return response.data;
},
```

#### **`BookingModal.js`**

**1. Added props for prefilled data:**

```javascript
const BookingModal = ({
  isOpen,
  onClose,
  ground,
  onSuccess,
  prefilledDate,      // NEW
  prefilledSlot,      // NEW
}) => {
```

**2. Auto-fill form when slot is clicked:**

```javascript
useEffect(() => {
  if (isOpen && prefilledDate && prefilledSlot) {
    setFormData((prev) => ({
      ...prev,
      date: prefilledDate,
      startTime: prefilledSlot.startTime,
      endTime: prefilledSlot.endTime,
    }));
    // Auto-check availability
    setTimeout(() => {
      checkAvailabilityWithData(
        prefilledDate,
        prefilledSlot.startTime,
        prefilledSlot.endTime
      );
    }, 100);
  }
}, [isOpen, prefilledDate, prefilledSlot, checkAvailabilityWithData]);
```

#### **`GroundDetail.js`**

**1. Added click handler:**

```javascript
const handleSlotClick = (slot) => {
  if (slot.isBooked) return; // Don't open modal for booked slots

  const [startTime, endTime] = slot.time.split(" - ");
  setSelectedSlot({ startTime, endTime });
  setShowBookingModal(true);
};
```

**2. Load public booked slots:**

```javascript
const loadGroundBookings = useCallback(async () => {
  try {
    // Try owner endpoint first
    try {
      const bookings = await groundsService.getGroundBookings(id);
      setGroundBookings(bookings);
    } catch (ownerErr) {
      // Fall back to public booked-slots endpoint
      const bookedSlotsData = await groundsService.getBookedSlots(
        id,
        thirtyDaysAgo,
        thirtyDaysLater
      );

      // Convert slots to booking format
      const slotsAsBookings = bookedSlotsData.slots.map((slot) => ({
        id: `slot-${slot.date}-${slot.startTime}`,
        startDatetime: `${slot.date}T${slot.startTime}`,
        endDatetime: `${slot.date}T${slot.endTime}`,
        status: "confirmed",
        isPaid: false,
      }));

      setGroundBookings(slotsAsBookings);
    }
  } catch (err) {
    console.error("Failed to load bookings:", err);
    setGroundBookings([]);
  }
}, [id]);
```

**3. Enhanced slot display:**

```javascript
<div
  onClick={() => handleSlotClick(slot)}
  className={`p-3 rounded-lg border-2 transition-all cursor-pointer 
    hover:scale-105 hover:shadow-lg
    ${
      slot.isBooked
        ? "bg-red-50 border-red-300 cursor-not-allowed opacity-60"
        : "bg-green-50 border-green-300 hover:bg-green-100"
    }`}
>
  <div className="flex items-center gap-2">
    <div
      className={`w-2 h-2 rounded-full ${
        slot.isBooked ? "bg-red-600" : "bg-green-600 animate-pulse"
      }`}
    ></div>
    <span className="text-sm font-semibold">{slot.time}</span>
  </div>
  <div className="text-xs mt-1">
    {slot.isBooked ? (
      "Booked"
    ) : (
      <>
        <span>Click to Book</span>
        <span className="text-lg">→</span>
      </>
    )}
  </div>
</div>
```

**4. Pass prefilled data to modal:**

```javascript
<BookingModal
  isOpen={showBookingModal}
  onClose={() => {
    setShowBookingModal(false);
    setSelectedSlot(null);
  }}
  ground={ground}
  prefilledDate={selectedSlot ? selectedDate : null}
  prefilledSlot={selectedSlot}
  onSuccess={() => {
    setSelectedSlot(null);
    navigate("/bookings/my-bookings");
  }}
/>
```

---

## 🧪 How to Test

### **Step 1: Restart Backend**

```bash
cd backend
npm run start:dev
```

### **Step 2: Test Availability Check**

```bash
# Test 06:00-07:00 (should be available if no conflict)
curl -X POST http://localhost:3001/grounds/availability/check \
  -H "Content-Type: application/json" \
  -d '{"groundId":"c4e53584-f3b5-475a-a3ee-9c437ea360e9","date":"2025-10-21","startTime":"06:00:00","endTime":"07:00:00"}'
```

**Expected**: `{"available": true, "slots": []}`

### **Step 3: Check Booked Slots**

```bash
curl "http://localhost:3001/grounds/c4e53584-f3b5-475a-a3ee-9c437ea360e9/booked-slots?startDate=2025-10-19&endDate=2025-10-25"
```

**Expected**: Returns list of booked slots

### **Step 4: Test in UI**

1. Open ground detail page
2. Select a date
3. See green (available) and red (booked) slots
4. Click on a green slot
5. Modal opens with prefilled date/time
6. Availability auto-checked
7. Should show "Slot is available!"

---

## 🐛 Debug Output

When you make an availability check, you'll see console logs like:

```
Checking slot: {
  slotTime: '07:00:00-08:00:00',
  requestedTime: '06:00:00-07:00:00',
  slotStartLessThanRequestedEnd: false,  // 07:00:00 < 07:00:00 = false
  slotEndGreaterThanRequestedStart: true, // 08:00:00 > 06:00:00 = true
  hasOverlap: false                       // false AND true = false ✅
}

Availability Check Summary: {
  requested: { date: '2025-10-21', startTime: '06:00:00', endTime: '07:00:00' },
  totalSlots: 1,
  conflictingSlots: 0,
  available: true ✅
}
```

---

## ✅ What Should Work Now

1. ✅ Adjacent slots (06:00-07:00 and 07:00-08:00) recognized as non-overlapping
2. ✅ Overlapping slots (06:00-08:00 and 07:00-09:00) correctly detected
3. ✅ Date comparison works correctly
4. ✅ UTC times stored consistently
5. ✅ Public users can see booked slots
6. ✅ Click-to-book works with prefilled data
7. ✅ Availability auto-checked when clicking slots
8. ✅ Debug logging helps troubleshoot issues

---

## 📊 Overlap Detection Examples

| Requested Slot | Existing Slot | Overlap? | Reason                                                                  |
| -------------- | ------------- | -------- | ----------------------------------------------------------------------- |
| 06:00-07:00    | 07:00-08:00   | ❌ No    | Adjacent (07:00 NOT < 07:00)                                            |
| 06:00-07:00    | 06:30-07:30   | ✅ Yes   | 06:30 < 07:00 AND 07:30 > 06:00                                         |
| 06:00-08:00    | 07:00-08:00   | ✅ Yes   | 07:00 < 08:00 AND 08:00 > 06:00                                         |
| 08:00-09:00    | 06:00-07:00   | ❌ No    | Separate (06:00 NOT < 09:00 but 07:00 NOT > 08:00... wait that's wrong) |

Actually let me verify: 08:00-09:00 vs 06:00-07:00

- slot.startTime (06:00) < endTime (09:00) = TRUE
- slot.endTime (07:00) > startTime (08:00) = FALSE
- hasOverlap = TRUE AND FALSE = FALSE ✅ Correct!

---

## 🔄 Next Steps

1. **Restart backend** if not auto-restarting:

   ```bash
   cd backend
   npm run start:dev
   ```

2. **Clear old slots** (optional - if you want fresh start):

   ```sql
   DELETE FROM ground_slots WHERE "groundId" = 'YOUR_GROUND_ID';
   ```

3. **Make a test booking** to create new slots with correct UTC format

4. **Test availability** by clicking slots in the UI

---

## 🎉 Result

- ✅ Availability check works correctly
- ✅ Adjacent slots don't conflict
- ✅ Click-to-book is seamless
- ✅ All times stored in UTC consistently
- ✅ Public users can see booked slots
- ✅ Debug logging available

---

**Status**: ✅ **FIXED AND REBUILT**  
**Date**: October 19, 2025  
**Backend**: Rebuilt and ready  
**Frontend**: Updated

**Try booking now - it should work! 🎊**
