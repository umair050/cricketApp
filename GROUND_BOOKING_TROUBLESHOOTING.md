# 🔧 Ground Booking - Troubleshooting Guide

## ✅ Issue Fixed: Port Mismatch

**Problem:** Frontend was calling `http://localhost:3000/api/grounds`  
**Solution:** Updated to `http://localhost:3001/api/grounds` ✅

---

## 🚀 Next Steps to Get It Working

### Step 1: Restart Backend Server

**Important:** You MUST restart the backend for the new GroundsModule to load!

```bash
cd backend
npm run start:dev
```

**Look for these logs:**

```
[Nest] LOG [GroundsModule] GroundsModule dependencies initialized
[Nest] LOG [RoutesResolver] GroundsController {/grounds}:
[Nest] LOG [RouterExplorer] Mapped {/grounds, POST} route
[Nest] LOG [RouterExplorer] Mapped {/grounds, GET} route
...
🏏 Cricket App Backend running on http://localhost:3001
```

### Step 2: Verify Backend is Running

Open in browser: `http://localhost:3001/api`

You should see the Swagger documentation with the new Grounds endpoints listed.

### Step 3: Test API Directly

Open your browser or use curl:

```bash
# Test grounds endpoint
curl http://localhost:3001/api/grounds

# Should return:
{
  "grounds": [],
  "total": 0,
  "page": 1,
  "totalPages": 0
}
```

### Step 4: Refresh Frontend

Refresh your browser at `http://localhost:3000/grounds`

The page should now load without errors!

---

## 🔍 Verification Checklist

### Backend Checks:

- [ ] Backend is running on port **3001** (not 3000)
- [ ] You see "GroundsController" in startup logs
- [ ] Can access `http://localhost:3001/api`
- [ ] Can access `http://localhost:3001/api/grounds` (returns empty array)
- [ ] Database connection successful

### Frontend Checks:

- [ ] Frontend is running on port **3000**
- [ ] Can login successfully
- [ ] "Grounds" link appears in sidebar
- [ ] "My Bookings" link appears in sidebar
- [ ] No console errors in browser

### Database Checks:

- [ ] PostgreSQL is running
- [ ] Database "cricketapp" exists
- [ ] Tables created (grounds, ground_slots, bookings, payments)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot GET /api/grounds" (404)

**Causes:**

- Backend not restarted after building new module
- GroundsModule not imported in AppModule
- Backend running on wrong port

**Solutions:**

1. Restart backend: `npm run start:dev`
2. Check `app.module.ts` has `GroundsModule` imported
3. Verify backend on port 3001: `http://localhost:3001/api`

---

### Issue 2: Database Connection Error

**Error:**

```
[TypeORM] Unable to connect to the database
```

**Solutions:**

1. Check PostgreSQL is running:

   ```bash
   pg_isready
   ```

2. Verify credentials in `backend/src/app.module.ts`:

   ```typescript
   host: 'localhost',
   port: 5432,
   username: 'postgres',
   password: 'cricketapp',
   database: 'cricketapp'
   ```

3. Test connection manually:
   ```bash
   psql -U postgres -d cricketapp
   ```

---

### Issue 3: Tables Not Created

**Error:**

```
relation "grounds" does not exist
```

**Solutions:**

1. Make sure `synchronize: true` in `app.module.ts`
2. Restart backend (tables create on startup)
3. Check logs for TypeORM errors

If tables still don't create, run manual migration:

```bash
psql -U postgres -d cricketapp < backend/database/migrations/create_ground_booking_tables.sql
```

---

### Issue 4: CORS Error in Frontend

**Error:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Backend already has CORS enabled for localhost:3000 and localhost:3001.
If you still see errors, check `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
});
```

---

### Issue 5: Authentication Errors

**Error:**

```
401 Unauthorized
```

**Solutions:**

1. Make sure you're logged in
2. Check token exists in localStorage:
   ```javascript
   localStorage.getItem("token");
   ```
3. Token format should be JWT
4. Try logging out and back in

---

### Issue 6: Frontend Shows Wrong Port

**Error:**
Frontend tries to call `http://localhost:3000/api/grounds`

**Solution:**
✅ Already fixed! Updated `groundsService.js` to use port 3001.

If you see this again, check:

```javascript
// In groundsService.js
const API_URL = "http://localhost:3001/api"; // Should be 3001
```

---

## 🧪 Test Each Feature

### Test 1: Browse Grounds (Public)

```bash
curl http://localhost:3001/api/grounds
```

**Expected:** `{ "grounds": [], "total": 0, "page": 1, "totalPages": 0 }`

### Test 2: Create Ground (Auth Required)

```bash
curl -X POST http://localhost:3001/api/grounds \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Ground",
    "description": "Test ground description",
    "address": "123 Test St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "pitchType": "turf",
    "hourlyRate": 5000,
    "dailyRate": 40000,
    "openTime": "06:00:00",
    "closeTime": "22:00:00"
  }'
```

**Expected:** Ground created with pending status

### Test 3: Check Availability (Public)

```bash
curl -X POST http://localhost:3001/api/grounds/availability/check \
  -H "Content-Type: application/json" \
  -d '{
    "groundId": "YOUR_GROUND_ID",
    "date": "2025-10-25",
    "startTime": "10:00:00",
    "endTime": "12:00:00"
  }'
```

**Expected:** `{ "available": true, "slots": [] }`

---

## 📋 Quick Diagnostic

Run this in your terminal to check everything:

```bash
# Check if backend is running
curl http://localhost:3001/api

# Check PostgreSQL
pg_isready

# Check database
psql -U postgres -d cricketapp -c "\dt"

# Check if tables exist
psql -U postgres -d cricketapp -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
```

---

## ✅ Success Indicators

When everything is working, you'll see:

### In Backend Logs:

```
[Nest] LOG [InstanceLoader] GroundsModule dependencies initialized
[Nest] LOG [RoutesResolver] GroundsController {/grounds}
[Nest] LOG [RouterExplorer] Mapped {/grounds, GET} route
🏏 Cricket App Backend running on http://localhost:3001
```

### In Browser Console (should be no errors):

```
✓ Redux store initialized
✓ Grounds page loaded
✓ API call to http://localhost:3001/api/grounds
```

### In Database:

```sql
cricketapp=# \dt
              List of relations
 Schema |       Name       | Type  |  Owner
--------+------------------+-------+----------
 public | grounds          | table | postgres
 public | ground_slots     | table | postgres
 public | bookings         | table | postgres
 public | payments         | table | postgres
```

---

## 🎯 Final Checklist

Before using the Ground Booking feature:

- [x] Backend compiled (`npm run build`) ✅
- [x] `synchronize: true` enabled ✅
- [x] Frontend API service points to port 3001 ✅
- [x] GroundsModule imported in AppModule ✅
- [ ] **Backend restarted** ⚠️ **DO THIS NOW!**
- [ ] Frontend refreshed

---

## 💡 Pro Tips

1. **Always restart backend after:**

   - Adding new modules
   - Creating new entities
   - Changing database config

2. **Check Swagger docs:**

   - `http://localhost:3001/api`
   - Shows all available endpoints
   - Interactive API testing

3. **Use browser DevTools:**

   - Network tab to see API calls
   - Console for errors
   - Redux DevTools for state

4. **Enable database logging:**
   - Already enabled in development
   - See all SQL queries in backend logs

---

## 🆘 Still Not Working?

If you still get 404 after restarting:

1. **Check backend logs** for errors
2. **Verify GroundsModule is loaded** in startup logs
3. **Test API directly** with curl/Postman
4. **Check browser console** for specific errors
5. **Clear browser cache** and refresh

---

**Remember:** The key issue was **port mismatch**. Backend is on **3001**, not 3000!

✅ **This is now fixed in the code.**  
⚠️ **Just restart your backend server!**
