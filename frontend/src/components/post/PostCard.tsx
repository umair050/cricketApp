import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

interface PostCardProps {
  post: {
    id: string;
    caption?: string;
    thumbnailUrl?: string;
    duration?: number;
    user: {
      firstName?: string;
      lastName?: string;
      username?: string;
    };
    createdAt: string;
    _count?: {
      likes?: number;
      comments?: number;
    };
  };
  onPress?: () => void;
  onMenuPress?: () => void;
  onLikePress?: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onDownloadPress?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onMenuPress,
  onLikePress,
  onCommentPress,
  onSharePress,
  onDownloadPress,
}) => {
  const displayName = post.user.firstName && post.user.lastName
    ? `${post.user.firstName} ${post.user.lastName}`
    : post.user.username || "Anonymous";

  const initials = (post.user.firstName?.[0] || 
    post.user.lastName?.[0] || 
    post.user.username?.[0] || 
    "U").toUpperCase();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.username}>{displayName}</Text>
            <Text style={styles.time}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onMenuPress}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Caption */}
      {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

      {/* Media */}
      {post.thumbnailUrl && (
        <TouchableOpacity style={styles.mediaContainer} onPress={onPress}>
          <Image
            source={{ uri: post.thumbnailUrl }}
            style={styles.media}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Ionicons
                name="play"
                size={30}
                color={theme.colors.text}
              />
            </View>
          </View>
          {post.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{post.duration}s</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <Ionicons name="heart-outline" size={22} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{post._count?.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.actionText}>{post._count?.comments || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onSharePress}>
          <Ionicons name="share-outline" size={22} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDownloadPress}>
          <Ionicons name="download-outline" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  username: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  time: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
  },
  caption: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  mediaContainer: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  durationBadge: {
    position: "absolute",
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  durationText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
});
