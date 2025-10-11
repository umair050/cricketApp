# Feeds Module - Reply & Share Features Update

## ✅ Completed Backend Changes

### 1. Database Schema Updates

#### FeedComment Entity (Updated)

- Added `replyCount` field to track number of replies
- Added self-referencing `parentComment` relation for nested comments
- Added `replies` relation to get child comments

####Feed

Share Entity (New)

```typescript
- id: Primary key
- post: ManyToOne relation to FeedPost
- user: ManyToOne relation to User
- shareText: Optional text when sharing
- createdAt: Timestamp
- Unique constraint: (post, user) - One share per user per post
```

#### FeedPost Entity (Updated)

- Added `shareCount` field to cache share count
- Added `shares` relation to get list of shares

### 2. New API Endpoints

#### Comment Replies

- `POST /feeds/comments/:commentId/replies` - Add a reply to a comment
- `GET /feeds/comments/:commentId/replies` - Get replies for a comment

#### Post Sharing

- `POST /feeds/:id/share` - Share a post
- `GET /feeds/:id/shares` - Get list of users who shared
- `DELETE /feeds/:id/share` - Unshare a post

## ✅ Completed Frontend Changes

### 1. API Service (feedAPI.js)

Added methods for:

- `addReply(commentId, data)`
- `getCommentReplies(commentId, params)`
- `sharePost(postId, shareText)`
- `getPostShares(postId)`
- `unsharePost(postId)`

### 2. FeedContext

Added context methods:

- `addReply(commentId, replyText)` - Add reply with error handling
- `getCommentReplies(commentId, page, limit)` - Get paginated replies
- `sharePost(postId, shareText)` - Share with UI update
- `unsharePost(postId)` - Unshare with UI update
- `getPostShares(postId)` - Get share list

All methods include proper error handling and optimistic UI updates.

## 🔨 Next Steps to Complete

### 1. Update CommentsModal Component

Add reply functionality to each comment:

```javascript
// In CommentsModal.js

const [replyTo, setReplyTo] = useState(null);
const [replyText, setReplyText] = useState("");
const [replies, setReplies] = useState({});

// Load replies for a comment
const loadReplies = async (commentId) => {
  const data = await getCommentReplies(commentId);
  setReplies((prev) => ({ ...prev, [commentId]: data.replies }));
};

// Submit reply
const handleSubmitReply = async (commentId) => {
  const reply = await addReply(commentId, replyText);
  setReplies((prev) => ({
    ...prev,
    [commentId]: [...(prev[commentId] || []), reply],
  }));
  setReplyText("");
  setReplyTo(null);
};

// In the JSX, add reply button to each comment:
<button onClick={() => setReplyTo(comment.id)}>Reply</button>;

// Show reply input when active:
{
  replyTo === comment.id && (
    <div>
      <input value={replyText} onChange={(e) => setReplyText(e.target.value)} />
      <button onClick={() => handleSubmitReply(comment.id)}>Post Reply</button>
    </div>
  );
}

// Show replies:
{
  replies[comment.id]?.map((reply) => (
    <div key={reply.id} className="ml-8">
      {/* Render reply similar to comment */}
    </div>
  ));
}
```

### 2. Create ShareModal Component

Create `frontend/src/components/Feed/ShareModal.js`:

```javascript
const ShareModal = ({ post, onClose, onShare }) => {
  const [shareText, setShareText] = useState("");

  const handleShare = async () => {
    await onShare(post.id, shareText);
    onClose();
  };

  return (
    <div className="modal">
      <h3>Share Post</h3>
      <div>Original post preview...</div>
      <textarea
        placeholder="Add your thoughts (optional)"
        value={shareText}
        onChange={(e) => setShareText(e.target.value)}
      />
      <button onClick={handleShare}>Share</button>
    </div>
  );
};
```

### 3. Update FeedCard Component

Update the Share button to be functional:

```javascript
// In FeedCard.js

const [showShareModal, setShowShareModal] = useState(false);
const [shareCount, setShareCount] = useState(post.shareCount || 0);

const handleShare = async (postId, shareText) => {
  await sharePost(postId, shareText);
  setShareCount((prev) => prev + 1);
};

// Update the share button:
<button onClick={() => setShowShareModal(true)}>Share ({shareCount})</button>;

{
  showShareModal && (
    <ShareModal
      post={post}
      onClose={() => setShowShareModal(false)}
      onShare={handleShare}
    />
  );
}
```

## 📊 Feature Comparison

| Feature       | Before                    | After                        |
| ------------- | ------------------------- | ---------------------------- |
| Comments      | Flat structure            | Threaded with replies        |
| Comment Depth | 1 level                   | 2 levels (comment + replies) |
| Share         | Button only (no function) | Full share functionality     |
| Share Text    | N/A                       | Optional text when sharing   |
| Share Count   | Not tracked               | Tracked and displayed        |
| Unshare       | Not possible              | Can unshare posts            |

## 🎨 UI/UX Improvements

### Comments with Replies

- **Reply Button**: Each comment has a "Reply" button
- **Nested Display**: Replies are indented and visually grouped
- **Reply Count**: Shows number of replies on parent comment
- **Load More**: Pagination for replies
- **Reply Indicator**: Visual distinction between comments and replies

### Share Functionality

- **Share Modal**: Clean modal for adding share text
- **Original Post Preview**: Shows original post in share modal
- **Share Count**: Displays in post card
- **Share List**: Can view who shared the post
- **Unshare Option**: Users can unshare their shares

## 🔐 Security & Permissions

### Replies

- ✅ Must be logged in to reply
- ✅ Can only delete own replies
- ✅ Replies inherit post's visibility

### Shares

- ✅ Must be logged in to share
- ✅ Can't share same post twice
- ✅ Can only unshare own shares
- ✅ Share increments counter atomically

## 🚀 Quick Testing Guide

### Test Comment Replies

1. Go to any post
2. Click "Comment"
3. Add a comment
4. Click "Reply" on the comment
5. Add a reply
6. ✅ Reply should appear nested under comment
7. ✅ Reply count should increase

### Test Post Sharing

1. Find a post you want to share
2. Click "Share" button
3. Add optional share text
4. Click "Share" in modal
5. ✅ Share count should increase
6. ✅ Modal should close
7. Click share button again
8. ✅ Should show "Already shared" or unshare option

## 📱 Mobile Considerations

- **Reply UI**: Use bottom sheet on mobile for better UX
- **Share Modal**: Full-screen modal on mobile
- **Nested Comments**: Adjust indentation for narrow screens
- **Touch Targets**: Ensure buttons are large enough (44x44px minimum)

## ⚡ Performance

- **Lazy Load Replies**: Replies load on demand, not with initial comments
- **Pagination**: Both comments and replies are paginated
- **Optimistic Updates**: UI updates immediately before API confirmation
- **Cached Counts**: Share and reply counts stored in database

## 🔮 Future Enhancements

- [ ] Deep nesting (3+ levels of replies)
- [ ] Reply notifications
- [ ] Share with specific users/groups
- [ ] Quote share (share with embedded post)
- [ ] Reshare counter (how many times shared)
- [ ] Share analytics
- [ ] Edit shares
- [ ] Share to external platforms

---

**Status**: Backend Complete ✅ | Frontend Partially Complete ⚠️
**Last Updated**: October 2025
