# Fix 404 Error on /feeds Endpoint 🔧

## ❌ The Problem

You're getting:

```
Request URL: http://localhost:3001/feeds?feedType=global&page=1&limit=10&sortBy=newest
Status Code: 404 Not Found
```

## ✅ The Solution

The backend needs to be **rebuilt and restarted** to load the new Feeds module.

## 🔨 Step-by-Step Fix

### Step 1: Stop the Backend

```bash
# In your backend terminal, press:
Ctrl + C
```

### Step 2: Rebuild the Backend

```bash
cd backend
npm run build
```

This compiles all the TypeScript files including the new feeds module.

### Step 3: Restart the Backend

```bash
npm run start:dev
```

### Step 4: Verify it's Working

You should see in the terminal:

```
🏏 Cricket App Backend running on http://localhost:3001
📚 API Documentation available at http://localhost:3001/api
```

### Step 5: Check the Database

The new tables will be automatically created:

```sql
feed_posts
feed_likes
feed_comments
feed_shares
feed_post_tagged_users
```

### Step 6: Test the Endpoint

```bash
curl http://localhost:3001/feeds
```

You should get a response (empty array or list of posts).

## 🎯 Why This Happens

1. **TypeScript Compilation**: The `.ts` files need to be compiled to `.js`
2. **Module Loading**: NestJS needs to load the FeedsModule
3. **Database Sync**: TypeORM needs to create the new tables
4. **Route Registration**: The /feeds routes need to be registered

## 🔍 Verification Checklist

After restart, verify these:

### Backend Checks

- [ ] Backend starts without errors
- [ ] See "Cricket App Backend running..." message
- [ ] No TypeScript compilation errors
- [ ] Database connection successful

### Database Checks

```sql
-- Connect to your database
psql -U postgres -d cricketapp

-- List tables starting with 'feed'
\dt feed*

-- You should see:
-- feed_comments
-- feed_likes
-- feed_posts
-- feed_shares
-- feed_post_tagged_users
```

### API Checks

```bash
# Test GET feeds
curl http://localhost:3001/feeds

# Should return:
{"posts":[],"total":0,"page":1,"limit":10}
# Or list of existing posts

# Test with authentication (replace YOUR_TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/feeds
```

## 🐛 Still Getting 404?

### Check 1: Is FeedsModule imported?

```typescript
// backend/src/app.module.ts
import { FeedsModule } from './feeds/feeds.module';

@Module({
  imports: [
    // ...
    FeedsModule, // ← Should be here
  ],
})
```

### Check 2: Are files in correct location?

```
backend/src/feeds/
├── entities/
│   ├── feed-post.entity.ts
│   ├── feed-like.entity.ts
│   ├── feed-comment.entity.ts
│   └── feed-share.entity.ts
├── dto/
│   ├── create-post.dto.ts
│   ├── update-post.dto.ts
│   ├── create-comment.dto.ts
│   └── feed-query.dto.ts
├── feeds.service.ts
├── feeds.controller.ts
└── feeds.module.ts
```

### Check 3: Controller decorator correct?

```typescript
// feeds.controller.ts
@Controller("feeds") // ← Should be 'feeds', not 'feed'
export class FeedsController {
  // ...
}
```

### Check 4: Any TypeScript errors?

```bash
cd backend
npm run build

# Look for any errors in output
# Should end with: "Successfully compiled"
```

## 🚨 Emergency Fix

If nothing works, try a clean rebuild:

```bash
cd backend

# Remove compiled files
rm -rf dist

# Remove node_modules (optional, takes longer)
rm -rf node_modules
npm install

# Rebuild
npm run build

# Start
npm run start:dev
```

## 📊 Expected Database Schema

### feed_posts table

```sql
CREATE TABLE feed_posts (
  id SERIAL PRIMARY KEY,
  userId INTEGER,
  content TEXT,
  mediaType VARCHAR,
  mediaUrls TEXT[],
  location VARCHAR,
  hashtags TEXT[],
  privacy VARCHAR,
  likeCount INTEGER DEFAULT 0,
  commentCount INTEGER DEFAULT 0,
  viewCount INTEGER DEFAULT 0,
  shareCount INTEGER DEFAULT 0,  -- NEW
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### feed_comments table

```sql
CREATE TABLE feed_comments (
  id SERIAL PRIMARY KEY,
  postId INTEGER,
  userId INTEGER,
  commentText TEXT,
  replyCount INTEGER DEFAULT 0,     -- NEW
  parentCommentId INTEGER,          -- NEW
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### feed_shares table (NEW)

```sql
CREATE TABLE feed_shares (
  id SERIAL PRIMARY KEY,
  postId INTEGER,
  userId INTEGER,
  shareText TEXT,
  createdAt TIMESTAMP,
  UNIQUE(postId, userId)
);
```

## ✅ Success Indicators

You'll know it's fixed when:

1. **Backend starts without errors**
2. **Can access** `http://localhost:3001/feeds`
3. **Frontend Feed page loads** without errors
4. **Can create a post** successfully
5. **Can comment** on posts
6. **Reply button appears** on comments
7. **Share button opens modal**

## 🎯 Quick Test Commands

### Test Backend is Running

```bash
curl http://localhost:3001/feeds
```

### Test with Sample Post (needs auth token)

```bash
# Get your token from browser localStorage or after login
curl -X POST http://localhost:3001/feeds \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test post",
    "privacy": "public"
  }'
```

### Test Reply Endpoint

```bash
# Reply to comment ID 1
curl -X POST http://localhost:3001/feeds/comments/1/replies \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "commentText": "Test reply"
  }'
```

### Test Share Endpoint

```bash
# Share post ID 1
curl -X POST http://localhost:3001/feeds/1/share \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "shareText": "Check this out!"
  }'
```

## 📱 Frontend Testing

### In Browser Console (F12)

```javascript
// Test if Redux is loaded
window.__REDUX_DEVTOOLS_EXTENSION__;

// Check if feed slice exists
// (After logging in and visiting feed page)
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Visit Feed page
4. Look for request to `/feeds?feedType=global...`
5. Should show Status: 200 OK (not 404)

## 🎉 Success!

Once you see:

- ✅ Feed page loads
- ✅ Can create posts
- ✅ Reply button on comments
- ✅ Share modal opens
- ✅ No 404 errors in console

**You're all set!** 🚀

---

## 📞 Still Stuck?

### Check These

1. **PostgreSQL running?**

   ```bash
   # Windows
   Get-Service postgresql*

   # Mac/Linux
   ps aux | grep postgres
   ```

2. **Environment variables set?**

   ```bash
   # backend/.env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=cricketapp
   DB_DATABASE=cricketapp
   JWT_SECRET=your_secret_key
   ```

3. **Port 3001 available?**
   ```bash
   # Check if port is in use
   netstat -ano | findstr :3001  # Windows
   lsof -i :3001                  # Mac/Linux
   ```

### Nuclear Option (Last Resort)

```bash
# Complete reset

# Backend
cd backend
rm -rf node_modules dist
npm install
npm run build
npm run start:dev

# Frontend
cd frontend
rm -rf node_modules
npm install
npm start
```

---

**Most Common Fix**: Just rebuild and restart the backend!

```bash
cd backend && npm run build && npm run start:dev
```

That's it! 99% of the time, this solves the 404 error. 🎯
