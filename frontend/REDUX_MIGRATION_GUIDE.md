# Redux Migration Guide

Complete guide for migrating from Context API to Redux

## 📦 Step 1: Install Dependencies

```bash
cd frontend
npm install @reduxjs/toolkit react-redux
```

## ✅ What's Already Done

1. ✅ Redux store created (`src/store/index.js`)
2. ✅ Feed slice with all async thunks (`src/store/slices/feedSlice.js`)
3. ✅ Invitation slice (`src/store/slices/invitationSlice.js`)
4. ✅ Sidebar slice (`src/store/slices/sidebarSlice.js`)
5. ✅ App.js updated with Redux Provider

## 🔄 Migration Examples

### 1. Feed Components

#### Before (with Context):

```javascript
import { useFeed } from "../../contexts/FeedContext";

const MyComponent = () => {
  const { posts, loading, fetchGlobalFeed, createPost } = useFeed();

  useEffect(() => {
    fetchGlobalFeed();
  }, []);

  return <div>...</div>;
};
```

#### After (with Redux):

```javascript
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost } from "../../store/slices/feedSlice";

const MyComponent = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(
      fetchPosts({ params: { feedType: "global", page: 1, limit: 10 } })
    );
  }, [dispatch]);

  const handleCreatePost = async (postData) => {
    await dispatch(createPost(postData)).unwrap();
  };

  return <div>...</div>;
};
```

### 2. Sidebar Component

#### Before (with Context):

```javascript
import { useSidebar } from "../../contexts/SidebarContext";

const Sidebar = () => {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();

  return <aside>...</aside>;
};
```

#### After (with Redux):

```javascript
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/sidebarSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isCollapsed, isMobile } = useSelector((state) => state.sidebar);

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  return <aside>...</aside>;
};
```

### 3. Invitations Component

#### Before (with Context):

```javascript
import { useInvitations } from "../../contexts/InvitationContext";

const Invitations = () => {
  const { invitations, loading, sendInvitation, acceptInvitation } =
    useInvitations();

  return <div>...</div>;
};
```

#### After (with Redux):

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvitations,
  sendInvitation,
  acceptInvitation,
  selectPendingReceivedCount,
} from "../../store/slices/invitationSlice";

const Invitations = () => {
  const dispatch = useDispatch();
  const { sent, received, loading } = useSelector((state) => state.invitations);
  const pendingCount = useSelector(selectPendingReceivedCount);

  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch]);

  const handleSend = async (data) => {
    await dispatch(sendInvitation(data)).unwrap();
  };

  return <div>...</div>;
};
```

## 🔧 Complete Component Updates

### Update Feed.js

```javascript
// frontend/src/pages/Feed/Feed.js
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  resetFeed,
  fetchTrendingHashtags,
} from "../../store/slices/feedSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";
import CreatePost from "../../components/Feed/CreatePost";
import FeedCard from "../../components/Feed/FeedCard";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, hasMore, trendingHashtags } = useSelector(
    (state) => state.feed
  );
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState("global");
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);

  useEffect(() => {
    loadInitialFeed();
    dispatch(fetchTrendingHashtags(10));
    return () => {
      dispatch(resetFeed());
    };
  }, []);

  const loadInitialFeed = async () => {
    const feedType = activeTab === "global" ? "global" : "personal";
    await dispatch(
      fetchPosts({ params: { feedType, page: 1, limit: 10 }, append: false })
    );
    setPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(resetFeed());
    const feedType = tab === "global" ? "global" : "personal";
    dispatch(
      fetchPosts({ params: { feedType, page: 1, limit: 10 }, append: false })
    );
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    const feedType = activeTab === "global" ? "global" : "personal";
    await dispatch(
      fetchPosts({
        params: { feedType, page: nextPage, limit: 10 },
        append: true,
      })
    );
    setPage(nextPage);
  }, [page, loading, hasMore, activeTab, dispatch]);

  // ... rest of component
};
```

### Update FeedCard.js

```javascript
// frontend/src/components/Feed/FeedCard.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleLike, deletePost } from "../../store/slices/feedSlice";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import CommentsModal from "./CommentsModal";

const FeedCard = ({ post, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { isDarkMode } = useDarkMode();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const handleLike = async () => {
    try {
      const result = await dispatch(toggleLike(post.id)).unwrap();
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deletePost(post.id)).unwrap();
        if (onDelete) {
          onDelete(post.id);
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post");
      }
    }
  };

  // ... rest of component
};
```

### Update CreatePost.js

```javascript
// frontend/src/components/Feed/CreatePost.js
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, uploadMedia } from "../../store/slices/feedSlice";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";

const CreatePost = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { loading, uploadingMedia } = useSelector((state) => state.feed);
  const { isDarkMode } = useDarkMode();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  // ... other state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && mediaFiles.length === 0) {
      alert("Please add some content or media");
      return;
    }

    try {
      // Upload media files if any
      let mediaUrls = [];
      if (mediaFiles.length > 0) {
        mediaUrls = await dispatch(uploadMedia(mediaFiles)).unwrap();
      }

      // Create post
      const postData = {
        content: content.trim(),
        mediaType,
        mediaUrls,
        location: location.trim() || undefined,
        hashtags: allHashtags.length > 0 ? allHashtags : undefined,
        privacy,
      };

      await dispatch(createPost(postData)).unwrap();

      // Reset form
      setContent("");
      setMediaFiles([]);
      // ... reset other fields

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  // ... rest of component
};
```

### Update CommentsModal.js

```javascript
// frontend/src/components/Feed/CommentsModal.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  getPostComments,
  deleteComment,
} from "../../store/slices/feedSlice";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";

const CommentsModal = ({ post, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { isDarkMode } = useDarkMode();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await dispatch(
        getPostComments({ postId: post.id, page: 1, limit: 20 })
      ).unwrap();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const result = await dispatch(
        addComment({ postId: post.id, commentText: newComment })
      ).unwrap();
      setComments((prev) => [result.comment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await dispatch(deleteComment({ commentId, postId: post.id })).unwrap();
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment:", error);
        alert("Failed to delete comment");
      }
    }
  };

  // ... rest of component
};
```

### Update Sidebar.js

```javascript
// frontend/src/components/Layout/Sidebar.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  toggleSidebar,
  setIsMobile,
  closeSidebar,
} from "../../store/slices/sidebarSlice";
// ... imports

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isCollapsed, isMobile } = useSelector((state) => state.sidebar);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      dispatch(setIsMobile(mobile));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleNavClick = () => {
    if (isMobile) {
      dispatch(closeSidebar());
    }
  };

  // ... rest of component with handleToggle and handleNavClick
};
```

### Update Invitations.js

```javascript
// frontend/src/pages/Invitations/Invitations.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvitations,
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  selectPendingReceivedCount,
  selectPendingSentCount,
} from "../../store/slices/invitationSlice";

const Invitations = () => {
  const dispatch = useDispatch();
  const { sent, received, loading, error } = useSelector(
    (state) => state.invitations
  );
  const pendingReceivedCount = useSelector(selectPendingReceivedCount);
  const pendingSentCount = useSelector(selectPendingSentCount);

  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch]);

  const handleSendInvitation = async (invitationData) => {
    try {
      await dispatch(sendInvitation(invitationData)).unwrap();
      // Refresh invitations
      dispatch(fetchInvitations());
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      await dispatch(acceptInvitation(invitationId)).unwrap();
      dispatch(fetchInvitations());
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleReject = async (invitationId) => {
    try {
      await dispatch(rejectInvitation(invitationId)).unwrap();
      dispatch(fetchInvitations());
    } catch (error) {
      console.error("Failed to reject invitation:", error);
    }
  };

  const handleCancel = async (invitationId) => {
    try {
      await dispatch(cancelInvitation(invitationId)).unwrap();
      dispatch(fetchInvitations());
    } catch (error) {
      console.error("Failed to cancel invitation:", error);
    }
  };

  // ... rest of component
};
```

## 🎯 Key Differences

| Aspect          | Context API          | Redux                              |
| --------------- | -------------------- | ---------------------------------- |
| Import          | `useFeed()`          | `useDispatch()`, `useSelector()`   |
| Get State       | Direct destructuring | `useSelector(state => state.feed)` |
| Call Actions    | Direct function call | `dispatch(action())`               |
| Async Handling  | Built into context   | `.unwrap()` for promises           |
| Multiple States | Multiple contexts    | Single store                       |

## 💡 Pro Tips

1. **Use `.unwrap()`** to handle promise results from async thunks
2. **Use selectors** for derived state (see `selectPendingReceivedCount`)
3. **Dispatch in useEffect** - add `dispatch` to dependency array
4. **Error handling** - wrap dispatch calls in try-catch
5. **Loading states** - check `loading` from state, not individual flags

## 🔍 Benefits of Redux

✅ Centralized state management  
✅ Better DevTools support  
✅ Time-travel debugging  
✅ Easier to test  
✅ Better performance with large state  
✅ Middleware support  
✅ Persistent state (with redux-persist)

## 📚 Additional Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)

---

**Migration Status**: Ready for implementation!
