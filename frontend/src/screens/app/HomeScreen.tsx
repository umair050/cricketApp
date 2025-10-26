import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { usePost } from "@/hooks/usePost";
import { useStory } from "@/hooks/useStory";
import { TopBar } from "@/components/common/TopBar";
import { StoryAvatar } from "@/components/story/StoryAvatar";
import { AddStoryButton } from "@/components/story/AddStoryButton";
import { PostCard } from "@/components/post/PostCard";

export const HomeScreen = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const { posts } = usePost();
  const { stories } = useStory();

  useEffect(() => {
    posts.refetch();
    stories.refetch();
  }, []);

  const renderPost = ({ item }: any) => (
    <PostCard
      post={item}
      onPress={() => {
        // Navigate to post detail
      }}
      onMenuPress={() => {
        // Show post menu
      }}
      onLikePress={() => {
        // Handle like
      }}
      onCommentPress={() => {
        // Handle comment
      }}
      onSharePress={() => {
        // Handle share
      }}
      onDownloadPress={() => {
        // Handle download
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopBar />

      {/* Stories Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesContainer}
        contentContainerStyle={styles.storiesContent}
      >
        {/* Add Story Button */}
        <AddStoryButton onPress={() => router.push("/(app)/create-story")} />

        {/* User Stories */}
        {stories.data?.data?.map((userStory: any, index: number) => {
          const hasUnviewed = userStory.hasUnviewed;
          const isOwnStory = userStory.user.id === user?.id;
          const displayName =
            userStory.user.firstName && userStory.user.lastName
              ? `${userStory.user.firstName} ${userStory.user.lastName}`
              : userStory.user.username || "User";

          return (
            <StoryAvatar
              key={userStory.user.id}
              username={displayName}
              profileImage={userStory.user.profileImage}
              hasUnviewed={hasUnviewed}
              isOwnStory={isOwnStory}
              onPress={() =>
                router.push({
                  pathname: "/(app)/story-viewer",
                  params: { userIndex: index },
                })
              }
            />
          );
        })}
      </ScrollView>

      {/* Posts Feed */}
      {posts.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      ) : posts.data?.data?.posts?.length > 0 ? (
        <FlatList
          data={posts.data.data.posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.feedList}
          refreshControl={
            <RefreshControl
              refreshing={posts.isRefetching}
              onRefresh={() => posts.refetch()}
              tintColor={theme.colors.primary}
            />
          }
        />
      ) : (
        <View style={styles.feedContainer}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderIcon}>🎬</Text>
            <Text style={styles.placeholderText}>No posts yet</Text>
            <Text style={styles.placeholderSubtext}>
              Start creating amazing content!
            </Text>
            <TouchableOpacity
              style={styles.createFirstPostButton}
              onPress={() => router.push("/(app)/create-post")}
            >
              <Text style={styles.createFirstPostText}>
                Create Your First Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  storiesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    maxHeight: 110,
  },

  storiesContent: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },

  feedContainer: {
    flex: 1,
    position: "relative",
  },

  videoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  placeholderIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },

  placeholderText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  placeholderSubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },

  createFirstPostButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },

  createFirstPostText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },

  feedList: {
    paddingBottom: 80,
    paddingTop: theme.spacing.md,
  },
});
