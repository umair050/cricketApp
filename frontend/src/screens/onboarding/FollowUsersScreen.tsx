import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { theme } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { useAppStore } from "@/store/appStore";

interface User {
  id: string;
  username: string;
  fullName: string;
  profileImage?: string;
  occupation?: string;
  isVerified: boolean;
  _count: {
    followers: number;
  };
}

export const FollowUsersScreen = () => {
  const router = useRouter();
  const { suggestions, follow, unfollow } = useUser();
  const { completeOnboarding } = useAppStore();

  const [search, setSearch] = useState("");
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const users: User[] = suggestions.data?.data || [];

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFollow = async (userId: string) => {
    const isFollowing = followedUsers.has(userId);

    try {
      if (isFollowing) {
        await unfollow.mutateAsync(userId);
        setFollowedUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await follow.mutateAsync(userId);
        setFollowedUsers((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleContinue = () => {
    completeOnboarding();
    router.replace("/(app)/home");
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isFollowing = followedUsers.has(item.id);

    return (
      <View style={styles.userItem}>
        <View style={styles.userInfo}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {item.fullName?.charAt(0) || item.username?.charAt(0) || "?"}
              </Text>
            </View>
          )}

          <View style={styles.userDetails}>
            <View style={styles.userNameContainer}>
              <Text style={styles.fullName}>
                {item.fullName || item.username}
              </Text>
              {item.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
            </View>
            <Text style={styles.occupation}>{item.occupation || "User"}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={() => handleToggleFollow(item.id)}
        >
          <Text
            style={[
              styles.followButtonText,
              isFollowing && styles.followingButtonText,
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (suggestions.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Follow Someone</Text>
        <Text style={styles.subtitle}>
          Follow someone you might know or you can skip them too
        </Text>

        <Input
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          leftIcon={<Text>🔍</Text>}
          containerStyle={styles.searchInput}
        />

        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },

  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },

  searchInput: {
    marginBottom: theme.spacing.md,
  },

  listContent: {
    paddingBottom: theme.spacing.lg,
  },

  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },

  avatarText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  userDetails: {
    flex: 1,
  },

  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  fullName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginRight: 4,
  },

  verifiedBadge: {
    fontSize: 14,
    color: theme.colors.primary,
  },

  occupation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },

  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
  },

  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  followButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },

  followingButtonText: {
    color: theme.colors.primary,
  },

  continueButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});
