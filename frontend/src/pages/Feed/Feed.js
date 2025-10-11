import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerTarget = useRef(null);

  // Fetch initial data
  useEffect(() => {
    loadInitialFeed();
    dispatch(fetchTrendingHashtags(10));
    return () => {
      dispatch(resetFeed());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load feed based on active tab
  const loadInitialFeed = async () => {
    setInitialLoading(true);
    try {
      const feedType = activeTab === "global" ? "global" : "personal";
      await dispatch(
        fetchPosts({
          params: { feedType, page: 1, limit: 10, sortBy: "newest" },
          append: false,
        })
      ).unwrap();
      setPage(1);
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    dispatch(resetFeed());

    // Load new feed
    const feedType = tab === "global" ? "global" : "personal";
    dispatch(
      fetchPosts({
        params: { feedType, page: 1, limit: 10, sortBy: "newest" },
        append: false,
      })
    );
  };

  // Load more posts (infinite scroll)
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    try {
      const feedType = activeTab === "global" ? "global" : "personal";
      await dispatch(
        fetchPosts({
          params: { feedType, page: nextPage, limit: 10, sortBy: "newest" },
          append: true,
        })
      ).unwrap();
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    }
  }, [page, loading, hasMore, activeTab, dispatch]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div
              className={`rounded-lg shadow-md p-6 mb-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h1
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Feed
              </h1>

              {/* Tabs */}
              <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleTabChange("global")}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeTab === "global"
                      ? "border-b-2 border-green-600 text-green-600"
                      : `${
                          isDarkMode
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-600 hover:text-gray-800"
                        }`
                  }`}
                >
                  Global Feed
                </button>
                <button
                  onClick={() => handleTabChange("personal")}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeTab === "personal"
                      ? "border-b-2 border-green-600 text-green-600"
                      : `${
                          isDarkMode
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-600 hover:text-gray-800"
                        }`
                  }`}
                >
                  My Posts
                </button>
              </div>
            </div>

            {/* Create Post */}
            <CreatePost onSuccess={loadInitialFeed} />

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {/* Posts List */}
            {initialLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <div
                className={`rounded-lg shadow-md p-12 text-center ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-400"
                    : "bg-white text-gray-500"
                }`}
              >
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <p className="text-lg font-medium">No posts yet</p>
                <p className="mt-2">
                  {activeTab === "personal"
                    ? "Be the first to share something!"
                    : "No posts to display"}
                </p>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <FeedCard key={post.id} post={post} />
                ))}

                {/* Infinite Scroll Observer Target */}
                <div ref={observerTarget} className="h-10" />

                {/* Loading More Indicator */}
                {loading && !initialLoading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                )}

                {/* End of Feed */}
                {!hasMore && posts.length > 0 && (
                  <div
                    className={`text-center py-8 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <p>You've reached the end!</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Trending Hashtags */}
            <div
              className={`rounded-lg shadow-md p-6 mb-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Trending Hashtags
              </h2>
              {trendingHashtags && trendingHashtags.length > 0 ? (
                <div className="space-y-3">
                  {trendingHashtags.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span
                        className={`${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        } hover:underline cursor-pointer`}
                      >
                        #{item.hashtag}
                      </span>
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {item.count} {item.count === 1 ? "post" : "posts"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  No trending hashtags yet
                </p>
              )}
            </div>

            {/* Feed Info */}
            <div
              className={`rounded-lg shadow-md p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                About Feed
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Share your cricket moments, connect with players, and stay
                updated with the latest from the cricket community.
              </p>
              <div
                className={`mt-4 pt-4 border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  What you can do:
                </h3>
                <ul
                  className={`text-sm space-y-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <li>• Share text, photos, and videos</li>
                  <li>• Tag players, teams, and tournaments</li>
                  <li>• Like and comment on posts</li>
                  <li>• Use hashtags to reach more people</li>
                  <li>• Add location to your posts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
