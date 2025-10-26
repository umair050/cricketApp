# 📱 Stories Feature - Complete Documentation

A professional Instagram/Facebook-style stories feature for CrikApp with expiring content, view tracking, and beautiful UI/UX.

## ✨ Features

### Core Functionality

- ✅ **24-Hour Expiration** - Stories automatically expire after 24 hours
- ✅ **View Tracking** - Track who viewed your stories
- ✅ **Multi-Story Support** - Post multiple stories that auto-advance
- ✅ **Full-Screen Viewer** - Immersive Instagram-style story viewer
- ✅ **Progress Bars** - Visual indicators for story progress
- ✅ **Interactive Controls** - Tap to skip, hold to pause, swipe to change users
- ✅ **Story Rings** - Colored rings indicate unviewed vs viewed stories
- ✅ **Captions** - Add text captions to your stories
- ✅ **Image & Video Support** - Post photos or short videos (up to 30s)

### Advanced Features

- ✅ **Smart Sorting** - Your stories first, then unviewed, then viewed
- ✅ **Auto-Refresh** - Stories refresh every 30 seconds
- ✅ **View Counts** - See how many people viewed your stories
- ✅ **Delete Stories** - Remove your stories anytime
- ✅ **Pull to Refresh** - Manual refresh support
- ✅ **Gesture Controls** - Swipe left/right to navigate between users

## 📊 Database Schema

### Story Model

```prisma
model Story {
  id              String    @id @default(cuid())
  userId          String
  mediaUrl        String    // Image or video URL
  mediaType       String    // 'image' or 'video'
  thumbnailUrl    String?
  caption         String?
  duration        Int?      // Duration in seconds for videos
  backgroundColor String?   // Hex color for text stories
  textColor       String?   // Hex color for text
  views           Int       @default(0)
  isActive        Boolean   @default(true)
  expiresAt       DateTime  // Stories expire after 24 hours

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(...)
  storyViews      StoryView[]
}
```

### StoryView Model

```prisma
model StoryView {
  id        String    @id @default(cuid())
  storyId   String
  userId    String
  createdAt DateTime  @default(now())

  story     Story     @relation(...)
  user      User      @relation(...)

  @@unique([storyId, userId])
}
```

## 🔌 Backend API Endpoints

### 1. Create Story

**POST** `/api/stories/create`

Creates a new story that expires in 24 hours.

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**

```json
{
  "mediaUrl": "https://example.com/story.jpg",
  "mediaType": "image",
  "caption": "Amazing day!",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "duration": 30,
  "backgroundColor": "#FF6B9D",
  "textColor": "#FFFFFF"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Story created successfully",
  "data": {
    "id": "story_123",
    "userId": "user_456",
    "mediaUrl": "...",
    "expiresAt": "2024-10-26T10:00:00.000Z",
    "user": {
      "id": "user_456",
      "username": "john_doe",
      "fullName": "John Doe"
    }
  }
}
```

### 2. Get All Stories

**GET** `/api/stories`

Fetches active stories from users you follow + your own stories.

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "user": {
        "id": "user_456",
        "username": "john_doe",
        "fullName": "John Doe",
        "profileImage": "..."
      },
      "stories": [
        {
          "id": "story_123",
          "mediaUrl": "...",
          "caption": "...",
          "createdAt": "...",
          "isViewed": false,
          "_count": {
            "storyViews": 10
          }
        }
      ],
      "hasUnviewed": true
    }
  ]
}
```

### 3. View Story

**POST** `/api/stories/:storyId/view`

Records that you viewed a story. Increments view count.

**Response:**

```json
{
  "success": true,
  "message": "Story view recorded"
}
```

### 4. Delete Story

**DELETE** `/api/stories/:storyId`

Deletes your own story (owner only).

**Response:**

```json
{
  "success": true,
  "message": "Story deleted successfully"
}
```

### 5. Get Story Details

**GET** `/api/stories/:storyId`

Gets detailed info about a story including all viewers.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "story_123",
    "caption": "...",
    "storyViews": [
      {
        "user": {
          "id": "...",
          "username": "...",
          "fullName": "..."
        },
        "createdAt": "..."
      }
    ],
    "_count": {
      "storyViews": 25
    }
  }
}
```

## 📱 Frontend Implementation

### Service Layer (`frontend/src/services/storyService.ts`)

```typescript
export const storyService = {
  async createStory(data: CreateStoryData) {
    const response = await api.post("/stories/create", data);
    return response.data;
  },

  async getStories() {
    const response = await api.get("/stories");
    return response.data;
  },

  async viewStory(storyId: string) {
    const response = await api.post(`/stories/${storyId}/view`);
    return response.data;
  },

  async deleteStory(storyId: string) {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  },
};
```

### Custom Hook (`frontend/src/hooks/useStory.ts`)

```typescript
export const useStory = () => {
  const queryClient = useQueryClient();

  const storiesQuery = useQuery({
    queryKey: ["stories"],
    queryFn: () => storyService.getStories(),
    refetchInterval: 30000, // Auto-refresh every 30s
  });

  const createStoryMutation = useMutation({
    mutationFn: (data: CreateStoryData) => storyService.createStory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return {
    stories: storiesQuery,
    createStory: createStoryMutation,
    viewStory: viewStoryMutation,
    deleteStory: deleteStoryMutation,
  };
};
```

## 🎨 UI Components

### 1. Create Story Screen

**Features:**

- Camera integration
- Gallery picker
- Video selection (max 30s)
- Caption input with character counter
- Preview before posting
- Beautiful card-based UI

**Navigation:**

```typescript
router.push("/(app)/create-story");
```

### 2. Story Viewer Screen

**Features:**

- Full-screen immersive experience
- Progress bars for multiple stories
- Tap left: Previous story
- Tap right: Next story
- Swipe left/right: Navigate between users
- Hold: Pause story
- Auto-advance after 5 seconds
- View counter for your own stories
- Delete option for your stories

**Navigation:**

```typescript
router.push({
  pathname: "/(app)/story-viewer",
  params: { userIndex: 0 },
});
```

### 3. Story Rings (Home Screen)

**Visual Indicators:**

- **Pink Ring**: Unviewed stories
- **Gray Ring**: Viewed stories
- **Dashed Ring**: Add your story button
- **"You" Label**: Your own stories always shown first

## 🎮 User Interactions

### Story Viewer Controls

| Action        | Gesture              | Result                  |
| ------------- | -------------------- | ----------------------- |
| Skip Forward  | Tap right side       | Next story              |
| Skip Backward | Tap left side        | Previous story          |
| Pause         | Hold anywhere        | Pause progress          |
| Next User     | Swipe left           | Next user's stories     |
| Previous User | Swipe right          | Previous user's stories |
| Close         | Tap X button         | Exit viewer             |
| Delete        | Tap 🗑️ (own stories) | Delete story            |

### Create Story Controls

| Action       | Button       | Result                 |
| ------------ | ------------ | ---------------------- |
| Take Photo   | 📷 Camera    | Opens camera           |
| Select Photo | 🖼️ Photo     | Opens gallery (images) |
| Select Video | 🎬 Video     | Opens gallery (videos) |
| Add Caption  | Text input   | Add text overlay       |
| Post         | Share button | Publish story          |

## 🚀 Getting Started

### 1. Run Database Migration

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

This creates the `stories` and `story_views` tables.

### 2. Start Backend

```bash
cd backend
npm run dev
```

Backend will be available at `http://localhost:3001`

### 3. Start Frontend

```bash
cd frontend
npx expo start
```

## 📝 Usage Examples

### Creating a Story

1. Open the app
2. Tap **"Your Story"** or the **+ button** in stories section
3. Choose:
   - **📷 Camera** - Take a photo
   - **🖼️ Photo** - Select from gallery
   - **🎬 Video** - Select video (max 30s)
4. Add a caption (optional)
5. Tap **"Share to Story"**
6. Done! Story expires in 24 hours

### Viewing Stories

1. Tap any story ring on home screen
2. Full-screen viewer opens
3. **Tap right side** to skip forward
4. **Tap left side** to go back
5. **Swipe left/right** to change users
6. **Hold** to pause
7. Stories auto-advance every 5 seconds

### Managing Your Stories

1. Tap "You" in stories section to view your stories
2. Tap **🗑️** icon to delete a story
3. See **👁️ view count** at bottom
4. Stories automatically delete after 24 hours

## 🎯 Technical Details

### Story Expiration

Stories are automatically filtered out when expired:

```typescript
expiresAt: {
  gt: new Date(); // Only show stories not yet expired
}
```

### View Tracking

- Views are recorded when a story is displayed
- Duplicate views from same user are prevented
- Story owners don't generate view counts for their own stories
- View count increments in real-time

### Performance Optimization

- **React Query Caching**: Stories cached for 30 seconds
- **Auto-Refresh**: Background updates every 30 seconds
- **Optimistic Updates**: Instant UI feedback
- **Image Optimization**: Thumbnails for faster loading

### Story Sorting Logic

1. **Your stories first**: Always at the beginning
2. **Unviewed stories**: Stories you haven't seen yet
3. **Viewed stories**: Stories you've already watched
4. **Within each group**: Sorted by latest story time

## 🔮 Future Enhancements

Potential features to add:

- [ ] **Story Replies** - DM the story creator
- [ ] **Story Reactions** - Quick emoji reactions
- [ ] **Story Mentions** - Tag other users
- [ ] **Story Highlights** - Save stories beyond 24 hours
- [ ] **Story Stickers** - GIFs, location, polls
- [ ] **Music Integration** - Add music to stories
- [ ] **AR Filters** - Face filters and effects
- [ ] **Boomerang/Layout** - Creative capture modes
- [ ] **Story Insights** - Detailed analytics
- [ ] **Close Friends** - Share with select group
- [ ] **Story Archive** - Access old stories
- [ ] **Multi-Photo Stories** - Multiple images in one story

## 🐛 Troubleshooting

### Stories Not Showing Up

1. Check if backend is running
2. Verify `.env` has correct API URL
3. Check network connection
4. Ensure you're following users with stories

### Can't Create Story

1. Check camera/gallery permissions
2. Verify backend is accessible
3. Check authentication token is valid
4. Ensure media file is not too large

### Stories Not Expiring

1. Backend automatically filters expired stories
2. Check server time is correct
3. Refresh the stories list
4. Stories are removed after 24 hours

## 📊 Testing

### Test Story Creation

```bash
# Create a story
curl -X POST http://localhost:3001/api/stories/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "mediaUrl": "https://picsum.photos/1080/1920",
    "mediaType": "image",
    "caption": "Test story!"
  }'
```

### Test Getting Stories

```bash
# Get all stories
curl -X GET http://localhost:3001/api/stories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test View Tracking

```bash
# Record a view
curl -X POST http://localhost:3001/api/stories/story_123/view \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Checklist

- [x] Database schema with expiration
- [x] Backend API endpoints (CRUD + view tracking)
- [x] Frontend service layer
- [x] React Query hooks with auto-refresh
- [x] Create Story screen with media picker
- [x] Full-screen Story Viewer
- [x] Progress bars and auto-advance
- [x] Tap and swipe gestures
- [x] Story rings on home screen
- [x] Unviewed/viewed indicators
- [x] View counts for own stories
- [x] Delete functionality
- [x] 24-hour expiration
- [x] Professional UI/UX

---

**Your Stories feature is fully functional and ready to use!** 🎉

Users can now create ephemeral content that expires in 24 hours, view friends' stories with beautiful animations, and track engagement with view counts.
