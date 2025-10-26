# 📹 Create Post Feature

A complete TikTok-style post creation feature for CrikApp.

## ✅ What's Been Created

### Backend (Next.js API)

1. **POST `/api/posts/create`**

   - Creates a new post with video and caption
   - Requires authentication
   - Validates video URL, caption, duration

2. **GET `/api/posts`**
   - Retrieves all posts (feed)
   - Includes pagination
   - Returns user info and engagement counts

### Frontend (React Native)

1. **Create Post Screen** (`frontend/src/screens/app/CreatePostScreen.tsx`)

   - Video recording with camera
   - Video selection from gallery
   - Caption input (500 char limit)
   - Additional options (music, hashtags, location)
   - Beautiful UI matching TikTok style

2. **Service Layer** (`frontend/src/services/postService.ts`)

   - API integration for creating posts
   - API integration for fetching posts

3. **Custom Hook** (`frontend/src/hooks/usePost.ts`)

   - React Query integration
   - Cache management
   - Automatic refetching

4. **Navigation**
   - Added "Create Post" button to home screen
   - Clicking the + button opens the create post screen

## 📱 How to Use

### From Home Screen:

1. Tap the **+ button** in the bottom navigation
2. Choose to **Record Video** or **Select from Gallery**
3. Add a **caption** (optional)
4. Tap **Post** to publish

### Features:

- ✅ Record video directly from camera
- ✅ Select video from gallery
- ✅ Add captions (up to 500 characters)
- ✅ Video preview before posting
- ✅ Character counter for caption
- ✅ Placeholder for music, hashtags, location
- ✅ Loading states and error handling

## 🔧 Technical Details

### Permissions Required:

- Camera access (for recording)
- Media library access (for gallery)

### Video Constraints:

- Maximum duration: 60 seconds
- Quality: High (1.0)
- Allows editing before posting

### State Management:

- **Zustand**: Not used (stateless screen)
- **React Query**: Post creation and caching
- **Local State**: Form data (caption, video URI)

## 🚀 Testing

### Test the Create Post Feature:

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend
cd frontend
npx expo start

# 3. In the app:
# - Go to home screen
# - Tap the + button
# - Record or select a video
# - Add a caption
# - Post!
```

### Test API Directly:

```bash
# Create a post (requires auth token)
curl -X POST http://localhost:3001/api/posts/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "caption": "My first post!",
    "videoUrl": "https://example.com/video.mp4",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "duration": 30
  }'

# Get all posts
curl -X GET http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Note on Video Upload

Currently, the feature uses **placeholder URLs** for videos. In a production app, you would:

1. **Upload video to cloud storage** (AWS S3, Cloudinary, etc.)
2. **Get the video URL** from the upload response
3. **Create the post** with the real video URL

### To Implement Real Video Upload:

```typescript
// Example with Cloudinary
const uploadVideo = async (uri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "video/mp4",
    name: "video.mp4",
  });
  formData.append("upload_preset", "your_preset");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/your_cloud/video/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};
```

## 🎨 UI Components

### Screen Layout:

- **Header**: Cancel, Title, Post button
- **Video Section**: Upload or preview
- **Caption Section**: Text input with counter
- **Options Section**: Music, Hashtags, Location
- **Post Button**: Primary action

### Styling:

- Follows app theme
- Dark mode by default
- Pink primary color (#FF6B9D)
- Consistent spacing and typography

## 🔮 Future Enhancements

- [ ] Video upload to cloud storage
- [ ] Video trimming and editing
- [ ] Add filters and effects
- [ ] Add music from library
- [ ] Hashtag suggestions
- [ ] Location picker
- [ ] Draft saving
- [ ] Multiple video selection
- [ ] Video compression
- [ ] Upload progress indicator

## 📊 Database Schema

The `Post` model in Prisma:

```prisma
model Post {
  id            String    @id @default(cuid())
  userId        String
  caption       String?
  videoUrl      String
  thumbnailUrl  String?
  duration      Int?
  views         Int       @default(0)
  isActive      Boolean   @default(true)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User      @relation(...)
  likes         Like[]
  comments      Comment[]
}
```

## ✅ Checklist

- [x] Backend API endpoints
- [x] Frontend service layer
- [x] Custom React Query hooks
- [x] Create post screen UI
- [x] Camera integration
- [x] Gallery integration
- [x] Caption input
- [x] Navigation integration
- [x] Error handling
- [x] Loading states
- [ ] Video upload to cloud
- [ ] Video compression
- [ ] Advanced editing features

---

**Your Create Post feature is ready to use!** 🎉
