# Feeds Module - Complete Implementation Guide

## 🎯 Overview

The Feeds Module is a comprehensive social feed system for the Cricket App that allows users to create posts with text, images, and videos, interact through likes and comments, and engage with the cricket community.

## 🏗️ Architecture

### Backend Structure (NestJS + TypeORM)

```
backend/src/feeds/
├── entities/
│   ├── feed-post.entity.ts       # Post entity with media, tags, privacy
│   ├── feed-like.entity.ts       # Like entity (unique per user per post)
│   └── feed-comment.entity.ts    # Comment entity
├── dto/
│   ├── create-post.dto.ts        # Post creation validation
│   ├── update-post.dto.ts        # Post update validation
│   ├── create-comment.dto.ts     # Comment creation validation
│   └── feed-query.dto.ts         # Feed filtering & pagination
├── feeds.service.ts              # Business logic
├── feeds.controller.ts           # API endpoints
└── feeds.module.ts               # Module configuration
```

### Frontend Structure (React)

```
frontend/src/
├── contexts/
│   └── FeedContext.js            # State management for feeds
├── services/
│   └── feedAPI.js                # API service layer
├── components/Feed/
│   ├── CreatePost.js             # Post creation component
│   ├── FeedCard.js               # Individual post display
│   └── CommentsModal.js          # Comments modal
└── pages/Feed/
    └── Feed.js                   # Main feed page
```

## 📊 Database Schema

### FeedPost

- **id**: Primary key
- **user**: ManyToOne relation to User (post author)
- **content**: Text content (max 1000 chars)
- **mediaType**: Enum (text, image, video, mixed)
- **mediaUrls**: Array of media URLs
- **location**: Optional location string
- **hashtags**: Array of hashtags
- **privacy**: Enum (public, friends, private)
- **likeCount**: Cached like count
- **commentCount**: Cached comment count
- **viewCount**: View counter
- **taggedUsers**: ManyToMany relation to Users
- **taggedTeam**: ManyToOne relation to Team
- **taggedTournament**: ManyToOne relation to Tournament
- **isActive**: Soft delete flag
- **createdAt**, **updatedAt**: Timestamps

### FeedLike

- **id**: Primary key
- **post**: ManyToOne relation to FeedPost
- **user**: ManyToOne relation to User
- **createdAt**: Timestamp
- **Unique constraint**: (post, user) - One like per user per post

### FeedComment

- **id**: Primary key
- **post**: ManyToOne relation to FeedPost
- **user**: ManyToOne relation to User
- **commentText**: Text content (max 500 chars)
- **isActive**: Soft delete flag
- **createdAt**, **updatedAt**: Timestamps

## 🔌 API Endpoints

### Posts

#### Create Post

```http
POST /feeds
Authorization: Bearer <token>

{
  "content": "Great match today! 🏏",
  "mediaType": "image",
  "mediaUrls": ["https://..."],
  "location": "Mumbai",
  "hashtags": ["cricket", "t20"],
  "privacy": "public",
  "taggedUserIds": [1, 2],
  "taggedTeamId": 5,
  "taggedTournamentId": 3
}
```

#### Get Posts (with filters)

```http
GET /feeds?feedType=global&page=1&limit=10&sortBy=newest
GET /feeds?feedType=personal
GET /feeds?feedType=user&userId=1
GET /feeds?feedType=team&teamId=5
GET /feeds?feedType=tournament&tournamentId=3
GET /feeds?mediaType=video
GET /feeds?hashtag=cricket
GET /feeds?location=Mumbai
```

**Query Parameters:**

- `feedType`: global | personal | friends | team | tournament | user
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: newest | most_liked | most_commented
- `mediaType`: text | image | video | mixed
- `hashtag`: Filter by hashtag
- `location`: Filter by location
- `userId`: For user feed
- `teamId`: For team feed
- `tournamentId`: For tournament feed

#### Get Single Post

```http
GET /feeds/:id
```

#### Update Post

```http
PATCH /feeds/:id
Authorization: Bearer <token>

{
  "content": "Updated content",
  "privacy": "friends"
}
```

#### Delete Post

```http
DELETE /feeds/:id
Authorization: Bearer <token>
```

### Likes

#### Toggle Like

```http
POST /feeds/:id/like
Authorization: Bearer <token>

Response:
{
  "liked": true,
  "likeCount": 42
}
```

#### Get Post Likes

```http
GET /feeds/:id/likes
```

### Comments

#### Add Comment

```http
POST /feeds/:id/comments
Authorization: Bearer <token>

{
  "commentText": "Great post!"
}
```

#### Get Comments

```http
GET /feeds/:id/comments?page=1&limit=20
```

#### Delete Comment

```http
DELETE /feeds/comments/:commentId
Authorization: Bearer <token>
```

### Trending

#### Get Trending Hashtags

```http
GET /feeds/trending/hashtags?limit=10
```

## 🎨 Frontend Components

### FeedContext

Provides state management for the entire feed system:

```javascript
import { useFeed } from "./contexts/FeedContext";

const MyComponent = () => {
  const {
    posts,
    loading,
    error,
    hasMore,
    fetchGlobalFeed,
    fetchPersonalFeed,
    createPost,
    toggleLike,
    addComment,
    deletePost,
  } = useFeed();

  // Use the methods...
};
```

### CreatePost Component

Features:

- Text input (max 1000 chars)
- Multi-file upload (up to 5 files)
- Image/video preview before upload
- Location input
- Hashtag input
- Privacy selector (public/friends/private)
- Auto-extract hashtags from content

### FeedCard Component

Features:

- User avatar and name
- Timestamp with "time ago" format
- Post content with hashtag highlighting
- Media gallery (images/videos)
- Like button (with animated state)
- Comment button
- Share button
- Like/comment counts
- Post menu (edit/delete for own posts)

### CommentsModal Component

Features:

- Post preview
- Comments list with pagination
- Add comment input
- Delete comment (own comments only)
- Real-time comment count update
- "Time ago" format for comments

### Feed Page

Features:

- Tab navigation (Global Feed / My Posts)
- Create post section
- Infinite scroll
- Loading states
- Empty states
- Trending hashtags sidebar
- Feed info sidebar

## 🔒 Privacy & Permissions

### Post Privacy Levels

1. **Public**: Visible to everyone
2. **Friends**: Visible to friends only (requires friendship feature)
3. **Private**: Visible only to the author

### Access Control

- Users can only edit/delete their own posts
- Users can only delete their own comments
- Users must be logged in to create posts, like, or comment
- Public posts can be viewed by anyone
- Private posts are only visible to the author

## 🎯 Key Features

### 1. Post Creation

- Rich text with hashtags
- Multiple images (JPEG/PNG)
- Video upload (MP4)
- Location tagging
- User/Team/Tournament tagging
- Privacy controls

### 2. Interactions

- Like/Unlike posts
- Comment on posts
- View like list
- View comment thread
- Share posts (placeholder for future)

### 3. Feed Types

- **Global Feed**: All public posts
- **Personal Feed**: User's own posts
- **User Feed**: Specific user's posts
- **Team Feed**: Posts tagged with a team
- **Tournament Feed**: Posts tagged with a tournament

### 4. Filtering & Sorting

- Sort by: Newest, Most Liked, Most Commented
- Filter by: Media type, Hashtag, Location
- Pagination with infinite scroll

### 5. Trending Hashtags

- Real-time trending hashtags
- Post count per hashtag
- Clickable for filtering (future enhancement)

## 🚀 Usage Examples

### Creating a Post

```javascript
const handleCreatePost = async () => {
  try {
    const post = await createPost({
      content: "Just won the match! 🏆",
      mediaUrls: ["https://..."],
      mediaType: "image",
      hashtags: ["cricket", "victory"],
      location: "Mumbai Stadium",
      privacy: "public",
    });
    console.log("Post created:", post);
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

### Fetching Global Feed

```javascript
useEffect(() => {
  fetchGlobalFeed(1, 10);
}, []);
```

### Toggling Like

```javascript
const handleLike = async (postId) => {
  const result = await toggleLike(postId);
  console.log("Liked:", result.liked);
  console.log("Total likes:", result.likeCount);
};
```

### Adding Comment

```javascript
const handleComment = async (postId, text) => {
  const comment = await addComment(postId, text);
  console.log("Comment added:", comment);
};
```

## 🔧 Configuration

### Backend Configuration

The module is automatically integrated into `app.module.ts`:

```typescript
import { FeedsModule } from "./feeds/feeds.module";

@Module({
  imports: [
    // ... other modules
    FeedsModule,
  ],
})
export class AppModule {}
```

### Frontend Configuration

The FeedProvider is wrapped around the app in `App.js`:

```javascript
<FeedProvider>
  <App />
</FeedProvider>
```

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layout
- Touch-friendly buttons
- Optimized media preview
- Mobile-friendly modals
- Collapsible sidebar on mobile

## 🎨 Dark Mode Support

All components support dark mode:

- Automatic theme detection
- Smooth theme transitions
- Consistent color scheme
- Proper contrast ratios

## ⚡ Performance Optimizations

1. **Infinite Scroll**: Load posts on-demand
2. **Lazy Loading**: Media loaded as needed
3. **Cached Counts**: Like/comment counts stored in post entity
4. **Optimistic Updates**: Immediate UI feedback
5. **Pagination**: Efficient data fetching
6. **Debounced Search**: (future enhancement)

## 🔮 Future Enhancements

### Phase 2

- [ ] Repost/Share functionality
- [ ] Post editing
- [ ] Image filters and editing
- [ ] Video trimming before upload
- [ ] Tag suggestions (users, teams)
- [ ] Mention notifications

### Phase 3

- [ ] Reels/Stories feature
- [ ] Live video streaming
- [ ] Post analytics (reach, impressions)
- [ ] Bookmarks/Save posts
- [ ] Report/Flag content
- [ ] AI content moderation

### Phase 4

- [ ] Advanced search
- [ ] Feed algorithm (personalized)
- [ ] Sponsored posts
- [ ] Post scheduling
- [ ] Multi-language support
- [ ] GIF support

## 🐛 Troubleshooting

### Post Not Appearing

- Check privacy settings
- Verify user authentication
- Check network requests
- Ensure post has content or media

### Media Upload Failing

- Check file size limits
- Verify file format
- Check cloud storage configuration
- Review CORS settings

### Comments Not Loading

- Verify post ID
- Check authentication
- Review API endpoint
- Check browser console for errors

## 📚 Related Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Components](./frontend/README.md)
- [Authentication Guide](./INVITATION_SYSTEM_GUIDE.md)
- [Dark Mode Guide](./DARK_MODE_COMPLETE.md)

## 🤝 Contributing

When adding features to the Feeds module:

1. Follow existing patterns
2. Add proper TypeScript types
3. Include validation in DTOs
4. Update this documentation
5. Add tests (when test suite is available)
6. Consider performance impact

## 📄 License

Part of the Cricket App project.

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Module Status**: ✅ Production Ready
