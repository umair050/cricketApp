import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { theme } from "@/constants/theme";

interface StoryAvatarProps {
  username: string;
  profileImage?: string;
  hasUnviewed: boolean;
  isOwnStory?: boolean;
  onPress?: () => void;
}

export const StoryAvatar: React.FC<StoryAvatarProps> = ({
  username,
  profileImage,
  hasUnviewed,
  isOwnStory = false,
  onPress,
}) => {
  const displayName = isOwnStory ? "You" : username;
  const initials = username[0]?.toUpperCase() || "U";

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.avatarWrapper,
          hasUnviewed && styles.avatarWrapperUnviewed,
          !hasUnviewed && styles.avatarWrapperViewed,
        ]}
      >
        <View style={styles.avatarInner}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {displayName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 70,
    marginRight: theme.spacing.md,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  avatarWrapperUnviewed: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatarWrapperViewed: {
    borderWidth: 3,
    borderColor: theme.colors.border,
  },
  avatarInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },
  username: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
    maxWidth: 70,
  },
});
