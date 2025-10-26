import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/authStore";
import { TopBar } from "@/components/common/TopBar";
import { Ionicons } from "@expo/vector-icons";

export const DiscoverUsersScreen = () => {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { suggestions, followUser, unfollowUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = suggestions.data?.data?.filter((user: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(userId);
      } else {
        await followUser.mutateAsync(userId);
      }
    } catch (error) {
      console.error("Follow/unfollow error:", error);
    }
  };

  const renderUser = ({ item }: any) => {
    const isFollowing = item.isFollowing || false;

    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {item.fullName?.[0] || item.username?.[0] || "U"}
              </Text>
            </View>
          )}

          <View style={styles.userDetails}>
            <Text style={styles.fullName}>
              {item.fullName || item.username || "User"}
            </Text>
            {item.username && (
              <Text style={styles.username}>@{item.username}</Text>
            )}
            {item.bio && (
              <Text style={styles.bio} numberOfLines={2}>
                {item.bio}
              </Text>
            )}
            {item._count && (
              <View style={styles.stats}>
                <Text style={styles.statText}>
                  {item._count.followers || 0} followers
                </Text>
                <Text style={styles.statDot}>•</Text>
                <Text style={styles.statText}>
                  {item._count.posts || 0} posts
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={() => handleFollowToggle(item.id, isFollowing)}
          disabled={followUser.isPending || unfollowUser.isPending}
        >
          {followUser.isPending || unfollowUser.isPending ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TopBar title="Discover People" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.colors.textSecondary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? "Search Results" : "Suggested for You"}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {filteredUsers?.length || 0} users
        </Text>
      </View>

      {/* Users List */}
      {suggestions.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : filteredUsers?.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={suggestions.isRefetching}
              onRefresh={() => suggestions.refetch()}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>{searchQuery ? "🔍" : "👥"}</Text>
          <Text style={styles.emptyTitle}>
            {searchQuery ? "No users found" : "No suggestions"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? "Try searching with a different name"
              : "Check back later for new people to follow"}
          </Text>
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },

  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },

  clearButton: {
    padding: theme.spacing.xs,
  },

  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  sectionSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },

  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.md,
  },

  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },

  avatarText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  userDetails: {
    flex: 1,
  },

  fullName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },

  username: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  bio: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginTop: 4,
    lineHeight: 18,
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },

  statDot: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginHorizontal: 6,
  },

  followButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    minWidth: 100,
    alignItems: "center",
  },

  followingButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  followButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  followingButtonText: {
    color: theme.colors.textSecondary,
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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  emptyIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },

  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  emptySubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
