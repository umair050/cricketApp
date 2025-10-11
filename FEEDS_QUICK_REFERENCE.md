# Feeds Module - Quick Reference Card

## 🚀 Quick Commands

### Start Development

```bash
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm start
```

### Access

- Frontend: http://localhost:3000/feed
- Backend API: http://localhost:3001/feeds
- Swagger Docs: http://localhost:3001/api (if configured)

## 📡 API Endpoints Cheat Sheet

| Method   | Endpoint                   | Description            | Auth     |
| -------- | -------------------------- | ---------------------- | -------- |
| `GET`    | `/feeds`                   | Get posts with filters | Optional |
| `GET`    | `/feeds/:id`               | Get single post        | Optional |
| `POST`   | `/feeds`                   | Create post            | Required |
| `PATCH`  | `/feeds/:id`               | Update post            | Required |
| `DELETE` | `/feeds/:id`               | Delete post            | Required |
| `POST`   | `/feeds/:id/like`          | Toggle like            | Required |
| `GET`    | `/feeds/:id/likes`         | Get likes              | No       |
| `POST`   | `/feeds/:id/comments`      | Add comment            | Required |
| `GET`    | `/feeds/:id/comments`      | Get comments           | No       |
| `DELETE` | `/feeds/comments/:id`      | Delete comment         | Required |
| `GET`    | `/feeds/trending/hashtags` | Get trending           | No       |

## 🔍 Query Parameters

### Get Posts

```
?feedType=global|personal|user|team|tournament
?page=1
?limit=10
?sortBy=newest|most_liked|most_commented
?mediaType=text|image|video|mixed
?hashtag=cricket
?location=Mumbai
?userId=1
?teamId=5
?tournamentId=3
```

## 💻 Code Snippets

### Use Feed Context

```javascript
import { useFeed } from "../../contexts/FeedContext";

const MyComponent = () => {
  const { posts, loading, fetchGlobalFeed, createPost } = useFeed();

  useEffect(() => {
    fetchGlobalFeed();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};
```

### Create Post

```javascript
const handleCreate = async () => {
  await createPost({
    content: "Hello World!",
    privacy: "public",
    hashtags: ["cricket"],
    location: "Mumbai",
  });
};
```

### Toggle Like

```javascript
const handleLike = async (postId) => {
  const { liked, likeCount } = await toggleLike(postId);
  console.log(`Post ${liked ? "liked" : "unliked"}, total: ${likeCount}`);
};
```

### Add Comment

```javascript
const handleComment = async (postId, text) => {
  await addComment(postId, text);
};
```

## 🎨 Component Props

### FeedCard

```javascript
<FeedCard
  post={{
    id: 1,
    user: { fullName: "John Doe" },
    content: "Post content",
    mediaUrls: ["url1", "url2"],
    likeCount: 10,
    commentCount: 5,
    isLikedByCurrentUser: false,
    createdAt: "2025-01-01",
  }}
  onDelete={(postId) => handleDelete(postId)}
/>
```

### CreatePost

```javascript
<CreatePost onSuccess={() => console.log("Post created!")} />
```

### CommentsModal

```javascript
<CommentsModal post={selectedPost} onClose={() => setShowModal(false)} />
```

## 🗄️ Entity Relationships

```
User ──────┐
           │
           ├─── FeedPost ───┬─── FeedLike ─── User
           │                 │
           │                 └─── FeedComment ─── User
           │
Team ──────┤
           │
Tournament ┘
```

## 🔐 Privacy Levels

| Level     | Description  | Who Can See      |
| --------- | ------------ | ---------------- |
| `public`  | Everyone     | All users        |
| `friends` | Friends only | User's friends   |
| `private` | Only me      | Post author only |

## 🎯 State Properties

### FeedContext State

```javascript
{
  posts: [],              // Array of post objects
  loading: false,         // Loading indicator
  error: null,           // Error message
  currentPage: 1,        // Current page number
  totalPosts: 0,         // Total post count
  hasMore: true,         // More posts available
  selectedPost: null,    // Currently selected post
  trendingHashtags: []   // Trending hashtags array
}
```

## 📝 Post Object Structure

```javascript
{
  id: 1,
  user: {
    id: 1,
    fullName: "John Doe",
    email: "john@example.com"
  },
  content: "Post content",
  mediaType: "image",
  mediaUrls: ["url1", "url2"],
  location: "Mumbai",
  hashtags: ["cricket", "sports"],
  privacy: "public",
  likeCount: 10,
  commentCount: 5,
  viewCount: 100,
  isLikedByCurrentUser: false,
  taggedUsers: [],
  taggedTeam: null,
  taggedTournament: null,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z"
}
```

## 🐛 Common Issues & Fixes

| Issue                       | Solution                           |
| --------------------------- | ---------------------------------- |
| Context not found           | Wrap app in `<FeedProvider>`       |
| 401 Unauthorized            | Check if user is logged in         |
| Media not loading           | Check CORS and media URLs          |
| Posts not appearing         | Check privacy settings and filters |
| Infinite scroll not working | Check `hasMore` flag and observer  |

## 📊 Performance Tips

1. **Pagination**: Use `limit` parameter (default: 10)
2. **Lazy Loading**: Images load as they appear
3. **Caching**: Like/comment counts cached in DB
4. **Optimistic Updates**: UI updates before API response
5. **Infinite Scroll**: Load more only when needed

## 🎨 Styling Classes (Tailwind)

### Dark Mode

```javascript
className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
```

### Responsive Grid

```javascript
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
```

### Button States

```javascript
className={`px-4 py-2 rounded-lg ${
  isLiked
    ? 'bg-red-500 text-white'
    : 'bg-gray-200 text-gray-700'
}`}
```

## 🔧 Environment Variables

```env
# Backend
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=cricketapp
JWT_SECRET=your_secret

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

## 📚 File Locations

```
Backend:  backend/src/feeds/
Frontend: frontend/src/components/Feed/
          frontend/src/pages/Feed/
          frontend/src/contexts/FeedContext.js
Docs:     FEEDS_MODULE_GUIDE.md
          FEEDS_SETUP_QUICKSTART.md
```

## ⌨️ Keyboard Shortcuts

| Key      | Action                    |
| -------- | ------------------------- |
| `Ctrl+B` | Toggle sidebar            |
| `Esc`    | Close modal               |
| `Enter`  | Submit comment (in input) |

## 🧪 Test User Flows

1. **Create Post**: Login → Feed → Type content → Post
2. **Like Post**: Find post → Click heart → See count increase
3. **Comment**: Click "Comment" → Type → Post
4. **Delete**: Click menu (⋮) → Delete → Confirm

## 📞 Debug Commands

```bash
# Check backend logs
npm run start:dev

# Check database
psql -U postgres -d cricketapp
\dt feed*

# Check API response
curl http://localhost:3001/feeds

# Clear browser storage
localStorage.clear()
sessionStorage.clear()
```

## ✅ Quick Health Check

```bash
# Backend running?
curl http://localhost:3001/feeds

# Database tables created?
psql -U postgres -d cricketapp -c "SELECT * FROM feed_posts LIMIT 1;"

# Frontend running?
curl http://localhost:3000
```

---

**💡 Pro Tip**: Keep this file open while developing with the Feeds module!
