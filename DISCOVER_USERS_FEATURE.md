# 👥 Discover Users Feature - Documentation

A professional user discovery and follow/unfollow feature for CrikApp, similar to Instagram's "Suggested for You" page.

## ✨ Features

### Core Functionality

- ✅ **User Listing** - Browse all active users on the platform
- ✅ **Smart Sorting** - Not-followed users first, then by popularity
- ✅ **Search Users** - Search by name, username, or email
- ✅ **Follow/Unfollow** - One-tap follow/unfollow with instant feedback
- ✅ **User Stats** - See follower count and post count
- ✅ **Profile Preview** - View bio, occupation, and verified status
- ✅ **Pull to Refresh** - Manual refresh to get latest users
- ✅ **Loading States** - Beautiful loading indicators

### UI/UX Features

- ✅ **Professional Design** - Instagram-style card layout
- ✅ **Avatar Placeholders** - Initials shown when no profile image
- ✅ **Real-time Updates** - Instant UI updates on follow/unfollow
- ✅ **Empty States** - Helpful messages when no users found
- ✅ **Search Filtering** - Live search with clear button
- ✅ **Responsive Layout** - Optimized for all screen sizes

## 📱 User Interface

### Screen Layout

```
┌─────────────────────────────┐
│ ← Discover People         │  Header with back button
├─────────────────────────────┤
│ 🔍 Search users...        ✕│  Search bar with clear
├─────────────────────────────┤
│ Suggested for You   12 users│  Section title
├─────────────────────────────┤
│ ┌───────────────────────┐  │
│ │ [👤] John Doe         │  │  User card with avatar
│ │     @johndoe          │  │  Username and bio
│ │     Love cricket!     │  │  Stats (followers/posts)
│ │     10 followers • 5  [Follow] │  Follow button
│ └───────────────────────┘  │
│ ┌───────────────────────┐  │
│ │ [👤] Jane Smith       │  │  Another user card
│ │     @janesmith        │  │
│ │     ...               [Following] │  Following state
│ └───────────────────────┘  │
└─────────────────────────────┘
```

## 🔌 Backend API

### Endpoint: Get User Suggestions

**GET** `/api/user/suggestions?limit=50`

Returns a list of users with smart sorting and follow status.

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Query Parameters:**

- `limit` (optional): Number of users to return (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "email": "john@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "profileImage": "https://...",
      "bio": "Love cricket and coding!",
      "occupation": "Software Engineer",
      "isVerified": false,
      "isFollowing": false,
      "_count": {
        "followers": 125,
        "posts": 34
      }
    }
  ]
}
```

### Sorting Logic

The backend automatically sorts users:

1. **Not followed users first** - New people to discover
2. **Then by follower count** - Most popular users
3. **Already followed users last** - Easy to manage existing follows

## 📱 Frontend Implementation

### Navigation

**From Home Screen:**

- **Top Right Icon** (👥): Opens Discover Users
- **Bottom Navigation** (🔍): Opens Discover Users

```typescript
// Navigate to discover screen
router.push("/(app)/discover-users");
```

### Features

#### 1. Search Functionality

- **Real-time filtering** as you type
- Search by: Full name, username, or email
- **Clear button** (✕) to reset search
- Shows "Search Results" when filtering

#### 2. User Cards

- **Avatar** or initial placeholder
- **Full name** and **@username**
- **Bio** (2 lines max)
- **Stats**: Follower count and post count
- **Follow button** with loading state

#### 3. Follow/Unfollow

- **One tap** to follow/unfollow
- **Instant UI update** (Follow → Following)
- **Button style changes** based on state:
  - **Pink button** = Follow
  - **Gray outlined** = Following
- **Loading spinner** during API call

#### 4. Empty States

- **No Users**: Helpful message when empty
- **No Search Results**: Try different search term
- **Loading**: Shows spinner with "Loading users..."

## 🎨 UI States

### Follow Button States

| State         | Appearance                  | Action            |
| ------------- | --------------------------- | ----------------- |
| Not Following | Pink filled button "Follow" | Click to follow   |
| Following     | Gray outlined "Following"   | Click to unfollow |
| Loading       | Spinner                     | Disabled          |

### Search States

| State      | Display                           |
| ---------- | --------------------------------- |
| No Query   | "Suggested for You" + all users   |
| Has Query  | "Search Results" + filtered users |
| No Results | Empty state with search icon      |

## 🚀 Usage Guide

### For Users

#### Discover New People

1. **Tap 👥 icon** in top right OR **🔍 in bottom nav**
2. Browse **"Suggested for You"** list
3. See user profiles with **bios and stats**

#### Follow Someone

1. Find a user you like
2. **Tap "Follow"** button
3. Button changes to **"Following"** ✅
4. User's stories will now appear on home screen

#### Unfollow Someone

1. Find user in list (they'll have **"Following"** button)
2. **Tap "Following"** button
3. Button changes back to **"Follow"**
4. You'll stop seeing their stories

#### Search Users

1. **Tap search bar** at top
2. **Type name or username**
3. Results filter in **real-time**
4. **Tap ✕** to clear search

#### Refresh List

1. **Pull down** on the list
2. Latest users will load
3. Follow statuses update

## 🔧 Technical Details

### State Management

- **React Query**: Manages user list cache
- **Optimistic Updates**: Instant UI feedback
- **Auto-refresh**: Updates follow status on screen focus
- **Error Handling**: Graceful failure with retry

### API Integration

- **GET /api/user/suggestions** - Fetch users
- **POST /api/user/follow** - Follow user
- **POST /api/user/follow** (with userId) - Unfollow user

### Performance

- **Pagination ready**: Backend supports `limit` parameter
- **Efficient search**: Client-side filtering for speed
- **Image loading**: Lazy loading for avatars
- **Optimistic UI**: No waiting for API responses

## 🎯 User Flows

### Flow 1: New User Discovery

```
Home Screen
    ↓ (tap 👥 icon)
Discover Users Screen
    ↓ (browse list)
Find Interesting User
    ↓ (tap "Follow")
User Added to Following
    ↓ (return to home)
See Their Stories & Posts
```

### Flow 2: Search & Follow

```
Discover Users Screen
    ↓ (tap search bar)
Type "john"
    ↓ (results filter)
See Matching Users
    ↓ (tap "Follow")
Follow User
    ↓ (clear search)
Back to Full List
```

### Flow 3: Manage Follows

```
Discover Users Screen
    ↓ (scroll list)
See Following Users (gray button)
    ↓ (tap "Following")
Confirm Unfollow
    ↓ (button changes)
No Longer Following
```

## 📊 Data Flow

```
┌──────────────┐
│  User Screen │
└──────┬───────┘
       │
       ├─ Fetch Suggestions
       │    ↓
       │  Backend API
       │    ↓
       │  ┌──────────────────────────┐
       │  │ 1. Get users you follow  │
       │  │ 2. Get all active users  │
       │  │ 3. Add isFollowing flag  │
       │  │ 4. Sort intelligently    │
       │  └──────────────────────────┘
       │    ↓
       │  Return Sorted List
       │    ↓
       └─ Display Users

       ├─ Tap Follow
       │    ↓
       │  POST /api/user/follow
       │    ↓
       │  Update Database
       │    ↓
       └─ Refresh List
```

## 🌟 Smart Features

### 1. Intelligent Sorting

- **Unfollowed users first**: Helps discover new people
- **By popularity**: Most followed users are more relevant
- **Followed users last**: Easy to see who you already follow

### 2. Follow Status Indicator

- Backend calculates `isFollowing` for each user
- Frontend shows appropriate button state
- No confusion about who you're following

### 3. Search Optimization

- **Client-side search**: Instant results, no API calls
- **Multiple fields**: Searches name, username, email
- **Case-insensitive**: Finds users regardless of case

### 4. Pull to Refresh

- **Manual refresh**: Get latest users anytime
- **Visual feedback**: Loading spinner
- **Updates follows**: Reflects recent changes

## 🔮 Future Enhancements

Potential features to add:

- [ ] **Follow Back Button**: Quick follow for users who follow you
- [ ] **Mutual Friends**: "Followed by X and Y others"
- [ ] **Categories**: Filter by occupation, location
- [ ] **Recent Activity**: "Posted 2 hours ago"
- [ ] **Suggested Based On**: "People you may know"
- [ ] **Block/Report**: User safety features
- [ ] **Profile Preview**: Quick look without navigating
- [ ] **Batch Actions**: Follow multiple users at once
- [ ] **Following/Followers Lists**: Separate tabs
- [ ] **User Recommendations**: ML-based suggestions

## 🐛 Troubleshooting

### No Users Showing Up

**Possible Causes:**

1. Backend not running
2. No other users in database
3. Network connection issue

**Solutions:**

1. Check backend is running: `npm run dev`
2. Create test users via signup
3. Check `.env` has correct API URL
4. Pull to refresh

### Follow Button Not Working

**Possible Causes:**

1. Not authenticated
2. Backend API error
3. Network timeout

**Solutions:**

1. Re-login to get fresh token
2. Check backend logs for errors
3. Retry after network stabilizes

### Search Not Working

**Possible Causes:**

1. Users don't match search query
2. No users have names/usernames set

**Solutions:**

1. Try searching by email
2. Clear search and browse all users
3. Ask users to complete profiles

## ✅ Integration Checklist

- [x] Backend API endpoint with follow status
- [x] Frontend screen with search
- [x] Follow/unfollow functionality
- [x] Loading and empty states
- [x] Navigation from home screen
- [x] User stats display
- [x] Profile image handling
- [x] Real-time updates
- [x] Error handling
- [x] Pull to refresh

---

**Your Discover Users feature is ready!** 🎉

Users can now easily find and follow other users, manage their follows, and discover new content creators on your platform!
