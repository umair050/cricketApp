# Share & Reply Features - Testing Guide 🧪

## 🎯 Prerequisites

### 1. Install Redux Dependencies

```bash
cd frontend
npm install @reduxjs/toolkit react-redux
```

### 2. Restart Backend

```bash
cd backend
# Stop current backend (Ctrl+C)
npm run build
npm run start:dev
```

**Important**: This creates the new database tables:

- Adds `shareCount` column to `feed_posts`
- Adds `replyCount`, `parentCommentId` to `feed_comments`
- Creates new `feed_shares` table

### 3. Start Frontend

```bash
cd frontend
npm start
```

## 🧪 Testing Comment Replies

### Step 1: Go to Feed

1. Login to your app
2. Click "Feed" in the sidebar
3. Find or create a post

### Step 2: Add a Comment

1. Click the "Comment" button on a post
2. CommentsModal opens
3. Type a comment: "Great post!"
4. Click "Post" or press Enter
5. ✅ Comment appears at the top

### Step 3: Reply to the Comment

1. Find your comment in the list
2. Look below the timestamp - you'll see "Reply" button
3. Click **"Reply"**
4. ✅ Reply input appears below the comment
5. Type your reply: "Thanks for sharing!"
6. Press Enter or click "Reply" button
7. ✅ Reply is posted

### Step 4: View Replies

1. After posting a reply, the comment shows: **"View 1 reply"** button
2. Click it
3. ✅ Replies expand with indentation and left border
4. ✅ Smaller avatar, lighter background
5. Click "Hide replies" to collapse

### Step 5: Delete a Reply (Optional)

1. Hover over your reply
2. Delete button (🗑️) appears on the right
3. Click it
4. Confirm deletion
5. ✅ Reply is removed
6. ✅ Reply count decreases

## 🔄 Testing Post Sharing

### Step 1: Find a Post to Share

1. Scroll through the feed
2. Find a post you want to share
3. Look at the bottom action buttons

### Step 2: Click Share Button

1. Click the **"Share"** button
2. ✅ ShareModal opens with dark overlay
3. ✅ You see the original post preview

### Step 3: Add Share Text (Optional)

1. In the textarea, type: "Check this out! 🏏"
2. This text will appear with your share

### Step 4: Share the Post

1. Click **"Share Post"** button
2. ✅ Modal closes
3. ✅ Share count increases (e.g., "Share (1)")
4. ✅ Original post author sees increased share count

### Step 5: Try Sharing Again

1. Click "Share" on the same post
2. Try to share again
3. ✅ Should show error: "You have already shared this post!"

### Step 6: View Who Shared (Backend)

```bash
# Using curl or Postman
curl http://localhost:3001/feeds/1/shares

# Response shows list of users who shared
```

## 🎨 Visual Indicators

### Comment Replies

```
📝 Parent Comment
   │ @JohnDoe - Great post!
   │ 2h ago • Reply • View 2 replies
   │
   ├─ 💬 Reply 1 (indented, left border)
   │  @JaneSmith - Thanks!
   │  1h ago
   │
   └─ 💬 Reply 2
      @MikeJones - Awesome!
      30m ago
```

### Share Button States

```
Before sharing:  [Share]
After sharing:   [Share (1)]  ← Count shows
Multiple shares: [Share (5)]
```

## 🔍 What to Look For

### Reply Features ✅

- [ ] Reply button visible on every comment
- [ ] Reply input appears when clicked
- [ ] Can type and submit reply
- [ ] Reply appears nested/indented
- [ ] Reply has different styling (lighter background)
- [ ] Reply count shows correctly
- [ ] "View replies" button appears
- [ ] Can hide/show replies
- [ ] Can delete own replies
- [ ] Press Enter submits reply
- [ ] Cancel button dismisses input

### Share Features ✅

- [ ] Share button is clickable
- [ ] ShareModal opens with overlay
- [ ] Original post shows in modal
- [ ] Can add optional share text
- [ ] "Share Post" button works
- [ ] Share count increases
- [ ] Can't share same post twice
- [ ] Error message for duplicate share
- [ ] Modal closes after sharing
- [ ] Share count persists on refresh

## 🐛 Common Issues & Fixes

### Issue: "Cannot read property 'replyCount' of undefined"

**Fix**: Backend not restarted. Rebuild and restart backend.

### Issue: "404 Not Found" on reply endpoint

**Fix**:

```bash
cd backend
npm run build
npm run start:dev
```

### Issue: Replies don't show up

**Fix**:

1. Check if "View replies" button is visible
2. Click it to load replies
3. Replies load on demand, not automatically

### Issue: Share button does nothing

**Fix**:

1. Check browser console for errors
2. Verify you're logged in
3. Check if ShareModal component is imported
4. Verify feedAPI has sharePost method

### Issue: ShareModal doesn't appear

**Fix**:

1. Check if ShareModal.js exists
2. Check import in FeedCard.js
3. Check browser console for errors
4. Verify useState for showShareModal

## 📸 Screenshots Reference

### Share Modal Layout

```
┌─────────────────────────────────┐
│ Share Post                    ✕ │
├─────────────────────────────────┤
│ 👤 Your Name                    │
│ ┌─────────────────────────────┐ │
│ │ Add your thoughts...        │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─── Original Post ───────────┐ │
│ │ 👤 Post Author              │ │
│ │ Post content here...        │ │
│ │ 📷 [Image preview]          │ │
│ │ ❤️ 10 likes  💬 5 comments  │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│           [Cancel] [Share Post] │
└─────────────────────────────────┘
```

### Comment with Replies

```
┌─ Comment ─────────────────────┐
│ 👤 John Doe                   │
│ Great match today!            │
│ 2h ago • Reply • View 2replies│
│                               │
│ ┌─ Replies ─────────────────┐ │
│ ├─ 👥 Jane: Thanks!         │ │
│ │  1h ago                    │ │
│ └─ 👥 Mike: Awesome!         │ │
│    30m ago                    │ │
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

## ✅ Final Checklist

### Backend

- [ ] Dependencies installed
- [ ] Backend rebuilt (`npm run build`)
- [ ] Backend running on port 3001
- [ ] Database tables created
- [ ] No errors in backend console

### Frontend

- [ ] Redux dependencies installed
- [ ] Frontend running on port 3000
- [ ] No errors in browser console
- [ ] Can navigate to /feed

### Features

- [ ] Can create posts
- [ ] Can like posts
- [ ] Can comment on posts
- [ ] **Can reply to comments** ✨
- [ ] **Can share posts** ✨
- [ ] Reply count updates
- [ ] Share count updates
- [ ] Can view nested replies
- [ ] Can delete own replies
- [ ] Dark mode works
- [ ] Mobile responsive

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ You click "Reply" and see reply input
2. ✅ You post a reply and it appears nested
3. ✅ Reply count shows "View 1 reply"
4. ✅ You click "Share" and modal opens
5. ✅ You can add text and share successfully
6. ✅ Share count increases to "Share (1)"
7. ✅ Trying to share again shows error
8. ✅ All features work in both light and dark mode
9. ✅ Everything works on mobile screens

## 🆘 Need Help?

### Check These Files

- `FEEDS_COMPLETE_FEATURES.md` - Complete feature list
- `REDUX_MIGRATION_GUIDE.md` - Redux usage examples
- `FEEDS_MODULE_GUIDE.md` - Full documentation
- `FEEDS_QUICK_REFERENCE.md` - Quick reference

### Debug Steps

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Redux DevTools (if installed)
5. Check backend terminal for errors

### Common Fixes

```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Rebuild backend
cd backend
rm -rf dist
npm run build
```

---

**Happy Testing!** 🎊

If you see replies nested under comments and can share posts with custom text, **CONGRATULATIONS** - everything is working perfectly! 🏆
