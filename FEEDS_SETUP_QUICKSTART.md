# Feeds Module - Quick Setup & Testing Guide

## 🚀 Quick Start

### 1. Database Migration

The database tables will be automatically created when you start the backend (since `synchronize: true` is enabled in development).

**Entities Created:**

- `feed_posts`
- `feed_likes`
- `feed_comments`
- `feed_post_tagged_users` (junction table)

### 2. Start the Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend should start on `http://localhost:3001`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend should start on `http://localhost:3000`

### 4. Access the Feed

1. Login to your account
2. Click on "Feed" in the sidebar
3. Start creating posts!

## 🧪 Testing the Features

### Test 1: Create a Text Post

1. Go to Feed page
2. Type: "Great cricket match today! #cricket #sports"
3. Click "Post"
4. ✅ Post should appear at the top of the feed

### Test 2: Create a Post with Images

1. Click the image icon in the create post area
2. Select 1-5 images from your computer
3. Add some text (optional)
4. Click "Post"
5. ✅ Post should show with image gallery

### Test 3: Like a Post

1. Find any post in the feed
2. Click the "Like" button (heart icon)
3. ✅ Button should turn red and like count should increase
4. Click again to unlike
5. ✅ Like count should decrease

### Test 4: Comment on a Post

1. Find any post
2. Click "Comment" button
3. Modal should open
4. Type a comment and click "Post"
5. ✅ Comment should appear in the list
6. ✅ Comment count on the post should increase

### Test 5: Delete Your Own Post

1. Find a post you created
2. Click the three dots menu (top right of post)
3. Click "Delete Post"
4. Confirm deletion
5. ✅ Post should disappear from feed

### Test 6: Filter Posts

1. Go to "My Posts" tab
2. ✅ Should only show your posts
3. Go back to "Global Feed"
4. ✅ Should show all public posts

### Test 7: Infinite Scroll

1. Scroll down to the bottom of the feed
2. ✅ More posts should load automatically
3. Keep scrolling until you reach the end
4. ✅ Should show "You've reached the end!" message

### Test 8: Privacy Settings

1. Create a new post
2. Click the settings icon (sliders)
3. Change privacy to "Friends Only"
4. Add location and hashtags
5. Click "Post"
6. ✅ Post should be created with the selected settings

### Test 9: Trending Hashtags

1. Create multiple posts with hashtags like #cricket, #t20, #ipl
2. Check the "Trending Hashtags" sidebar
3. ✅ Hashtags should appear with post counts

### Test 10: Dark Mode

1. Toggle dark mode from the navbar
2. ✅ Feed page should switch to dark theme
3. ✅ All components should be readable in dark mode

## 📝 API Testing (Optional)

You can test the API endpoints using Postman or curl:

### Get Posts

```bash
curl http://localhost:3001/feeds
```

### Create Post (requires authentication)

```bash
curl -X POST http://localhost:3001/feeds \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test post from API",
    "privacy": "public"
  }'
```

### Like a Post

```bash
curl -X POST http://localhost:3001/feeds/1/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Comment

```bash
curl -X POST http://localhost:3001/feeds/1/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commentText": "Great post!"
  }'
```

### Get Trending Hashtags

```bash
curl http://localhost:3001/feeds/trending/hashtags
```

## 🔧 Troubleshooting

### Backend Issues

#### Error: "Cannot find module '@nestjs/typeorm'"

```bash
cd backend
npm install @nestjs/typeorm typeorm
```

#### Error: "Entity not found"

```bash
# Make sure the entities are properly exported
# Check backend/src/feeds/entities/*.entity.ts
```

#### Database Connection Error

```bash
# Check your PostgreSQL is running
# Verify .env file has correct database credentials
```

### Frontend Issues

#### Error: "Cannot find module 'lucide-react'"

```bash
cd frontend
npm install lucide-react
```

#### Context Error: "useFeed must be used within a FeedProvider"

```bash
# Make sure FeedProvider is wrapped in App.js
# Check frontend/src/App.js
```

#### API Call Failing (CORS error)

```bash
# Check backend CORS configuration in main.ts
# Should allow http://localhost:3000
```

## 📊 Database Verification

You can verify the tables were created correctly:

```sql
-- Connect to your PostgreSQL database
psql -U postgres -d cricketapp

-- Check if tables exist
\dt feed*

-- View table structure
\d feed_posts
\d feed_likes
\d feed_comments

-- Sample queries
SELECT * FROM feed_posts;
SELECT * FROM feed_likes;
SELECT * FROM feed_comments;
```

## 🎯 Sample Test Data

Want to populate some test data? Use the API to create sample posts:

```bash
# Post 1
curl -X POST http://localhost:3001/feeds \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Just finished an amazing practice session! Ready for the big match. #cricket #training",
    "privacy": "public",
    "location": "Mumbai Cricket Ground"
  }'

# Post 2
curl -X POST http://localhost:3001/feeds \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Congratulations to Team A for winning the tournament! 🏆 #ipl #cricket",
    "privacy": "public",
    "hashtags": ["ipl", "cricket", "champions"]
  }'
```

## ✅ Feature Checklist

After setup, verify these features work:

- [ ] Create text post
- [ ] Create post with images
- [ ] Create post with video
- [ ] Like/unlike posts
- [ ] Add comments
- [ ] Delete own comments
- [ ] Delete own posts
- [ ] View global feed
- [ ] View personal feed
- [ ] Infinite scroll works
- [ ] Trending hashtags display
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Privacy settings work
- [ ] Location tagging works
- [ ] Hashtag extraction works

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click device toolbar (mobile icon)
3. Select a mobile device (e.g., iPhone 12)
4. Test all features in mobile view

## 🔐 Security Testing

1. Try to delete someone else's post → Should fail
2. Try to delete someone else's comment → Should fail
3. Try to create post without login → Should redirect to login
4. Try to access private posts → Should not appear in feed

## 📈 Performance Testing

1. Create 50+ posts
2. Scroll through feed
3. ✅ Should load smoothly with infinite scroll
4. ✅ Images should lazy load
5. ✅ No memory leaks (check Chrome DevTools Performance tab)

## 🎉 Success!

If all tests pass, your Feeds module is working correctly!

## 📚 Next Steps

1. Add more test users to see different perspectives
2. Try tagging teams and tournaments
3. Experiment with different media types
4. Test edge cases (very long posts, many hashtags, etc.)
5. Monitor backend logs for any errors

## 🆘 Need Help?

Check these resources:

- [FEEDS_MODULE_GUIDE.md](./FEEDS_MODULE_GUIDE.md) - Complete documentation
- Backend logs: Check terminal where `npm run start:dev` is running
- Frontend logs: Check browser console (F12)
- Network requests: Check browser DevTools Network tab

---

**Happy Testing!** 🏏
