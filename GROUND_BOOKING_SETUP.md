# 🚀 Ground Booking Marketplace - Quick Setup

## ✅ Backend Setup Complete!

All ground booking files have been created and compiled successfully.

---

## 📋 What to Do Next

### Step 1: Restart Your Backend Server

**Stop your current backend server** (if running), then restart it:

```bash
cd backend
npm run start:dev
```

When the server starts, TypeORM will **automatically create** all the ground booking tables:
- ✅ `grounds` - Ground listings
- ✅ `ground_slots` - Time slot management  
- ✅ `bookings` - Booking records
- ✅ `payments` - Payment transactions

You should see in the console:
```
🏏 Cricket App Backend running on http://localhost:3001
📚 API Documentation available at http://localhost:3001/api
```

---

### Step 2: Start Your Frontend

In a new terminal:

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🎯 Testing the Ground Booking System

### 1. Access the UI

After both servers are running:
1. Open browser: `http://localhost:3000`
2. Login or Register
3. Click **"Grounds"** in the sidebar

### 2. Browse Grounds

- You'll see the browse page with search and filters
- Currently empty (no grounds listed yet)

### 3. List Your First Ground

Navigate to **"My Grounds"** page (you can add this to sidebar or access via URL):
- URL: `http://localhost:3000/grounds/owner/my-grounds`
- Click **"List New Ground"** button
- Fill in the form:
  - Ground name, description
  - Location (city, state, address)
  - Pricing (hourly & daily rates)
  - Operating hours
  - Amenities
  - Images (use placeholder URLs for now)

Example image URLs you can use:
```
https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800
https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800
```

### 4. Approve Ground (Manual DB Update)

Since we haven't implemented admin panel yet, manually approve the ground:

```sql
-- Connect to your database
psql -U postgres -d cricketapp

-- Update ground status to approved
UPDATE grounds SET status = 'approved' WHERE id = 'YOUR_GROUND_ID';
```

Or use a database GUI tool (pgAdmin, DBeaver, etc.)

### 5. Book a Ground

1. Go to **"Grounds"** in sidebar
2. Click on a ground card
3. Click **"Book Now"**
4. Select date and time
5. Click **"Check Availability"**
6. If available, confirm booking

### 6. View Your Bookings

Navigate to **"My Bookings"** in the sidebar to see all your bookings!

---

## 🔧 API Endpoints Available

All endpoints are now live at `http://localhost:3001/api/grounds`:

### Public Endpoints (No Auth)
```
GET  /api/grounds                    - Browse grounds
GET  /api/grounds/:id                - View ground details
POST /api/grounds/availability/check - Check availability
```

### User Endpoints (JWT Required)
```
POST  /api/grounds/bookings                  - Create booking
GET   /api/grounds/bookings/user/my-bookings - Get my bookings
POST  /api/grounds/bookings/:id/cancel       - Cancel booking
```

### Owner Endpoints (JWT + Ownership)
```
POST  /api/grounds              - Create ground
GET   /api/grounds/owner/my-grounds - Get my grounds
PATCH /api/grounds/:id          - Update ground
GET   /api/grounds/:id/bookings - View ground bookings
```

---

## 📊 Verify Database Tables

Connect to PostgreSQL and check tables were created:

```bash
psql -U postgres -d cricketapp
```

```sql
-- List all tables
\dt

-- Check grounds table
SELECT * FROM grounds;

-- Check bookings table  
SELECT * FROM bookings;
```

You should see:
- `grounds`
- `ground_slots`
- `bookings`
- `payments`

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Solution:** Check that all dependencies are installed:
```bash
cd backend
npm install
```

### Issue: Database connection error

**Solution:** Verify PostgreSQL is running and credentials are correct:
```bash
# Check if PostgreSQL is running
pg_isready

# Check your .env or credentials in app.module.ts
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=cricketapp
DB_DATABASE=cricketapp
```

### Issue: Tables not created

**Solution:** Make sure `synchronize: true` is enabled in `backend/src/app.module.ts`

### Issue: 404 on /api/grounds

**Solution:** 
1. Make sure backend is restarted after the build
2. Check the backend logs for any errors
3. Verify GroundsModule is imported in AppModule

---

## 🎨 Accessing the UI Pages

### Via Sidebar:
- **Grounds** → Browse grounds (`/grounds`)
- **My Bookings** → View bookings (`/bookings/my-bookings`)

### Direct URLs:
- Browse: `http://localhost:3000/grounds`
- Ground Details: `http://localhost:3000/grounds/:id`
- My Grounds: `http://localhost:3000/grounds/owner/my-grounds`
- My Bookings: `http://localhost:3000/bookings/my-bookings`

---

## 🎉 You're All Set!

Once you restart the backend:
1. ✅ All API endpoints will work
2. ✅ Database tables will be created
3. ✅ Frontend UI is ready
4. ✅ Full booking flow operational

**Happy Ground Booking! 🏏**

---

## 📚 Documentation

For complete details, see:
- **API Documentation:** `GROUND_BOOKING_API_DOCUMENTATION.md`
- **Frontend Guide:** `GROUND_BOOKING_FRONTEND_GUIDE.md`
- **Quick Start:** `GROUND_BOOKING_QUICKSTART.md`

