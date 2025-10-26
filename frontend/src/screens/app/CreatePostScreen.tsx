import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/common/Button";
import { theme } from "@/constants/theme";
import { usePost } from "@/hooks/usePost";

export const CreatePostScreen = () => {
  const router = useRouter();
  const { createPost } = usePost();

  const [caption, setCaption] = useState("");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  const pickVideo = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need access to your media library"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
        // You can generate thumbnail here or use a frame from the video
        setThumbnailUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const recordVideo = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need camera access to record videos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
        setThumbnailUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Failed to record video");
    }
  };

  const handlePost = async () => {
    if (!videoUri) {
      Alert.alert("No Video", "Please select or record a video");
      return;
    }

    // In a real app, you'd upload the video to cloud storage first
    // For now, we'll use a placeholder URL
    const mockVideoUrl = "https://example.com/videos/placeholder.mp4";
    const mockThumbnailUrl = "https://example.com/thumbnails/placeholder.jpg";

    try {
      await createPost.mutateAsync({
        caption,
        videoUrl: mockVideoUrl,
        thumbnailUrl: mockThumbnailUrl,
        duration: 30, // Mock duration
      });

      Alert.alert("Success", "Post created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create post"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={createPost.isPending}>
          <Text
            style={[styles.postButton, createPost.isPending && styles.disabled]}
          >
            {createPost.isPending ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Video Preview */}
        {videoUri ? (
          <View style={styles.videoPreview}>
            <Image
              source={{ uri: thumbnailUri || videoUri }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <View style={styles.videoOverlay}>
              <Text style={styles.videoIcon}>▶️</Text>
              <Text style={styles.videoText}>Video Selected</Text>
            </View>
            <TouchableOpacity
              style={styles.changeVideoButton}
              onPress={pickVideo}
            >
              <Text style={styles.changeVideoText}>Change Video</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadSection}>
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadIcon}>🎬</Text>
              <Text style={styles.uploadTitle}>Add Your Video</Text>
              <Text style={styles.uploadSubtitle}>
                Select from gallery or record new
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={recordVideo}
              >
                <Text style={styles.uploadButtonIcon}>📹</Text>
                <Text style={styles.uploadButtonText}>Record Video</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
                <Text style={styles.uploadButtonIcon}>🖼️</Text>
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Caption Input */}
        <View style={styles.captionSection}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={500}
            value={caption}
            onChangeText={setCaption}
            textAlignVertical="top"
          />
          <Text style={styles.captionCounter}>{caption.length}/500</Text>
        </View>

        {/* Additional Options */}
        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionIcon}>🎵</Text>
            <Text style={styles.optionText}>Add Music</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionIcon}>🏷️</Text>
            <Text style={styles.optionText}>Add Hashtags</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionIcon}>📍</Text>
            <Text style={styles.optionText}>Add Location</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {videoUri && (
          <Button
            title="Post Video"
            onPress={handlePost}
            loading={createPost.isPending}
            style={styles.mainPostButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  cancelButton: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },

  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },

  postButton: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },

  disabled: {
    opacity: 0.5,
  },

  content: {
    padding: theme.spacing.lg,
  },

  uploadSection: {
    marginBottom: theme.spacing.xl,
  },

  uploadPlaceholder: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },

  uploadIcon: {
    fontSize: 60,
    marginBottom: theme.spacing.md,
  },

  uploadTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  uploadSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },

  buttonContainer: {
    gap: theme.spacing.md,
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  uploadButtonIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },

  uploadButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },

  videoPreview: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },

  videoThumbnail: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.surface,
  },

  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  videoIcon: {
    fontSize: 50,
    marginBottom: theme.spacing.sm,
  },

  videoText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },

  changeVideoButton: {
    position: "absolute",
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },

  changeVideoText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },

  captionSection: {
    marginBottom: theme.spacing.xl,
  },

  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  captionInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    minHeight: 100,
  },

  captionCounter: {
    textAlign: "right",
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },

  optionsSection: {
    marginBottom: theme.spacing.xl,
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },

  optionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },

  optionText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },

  optionArrow: {
    color: theme.colors.textSecondary,
    fontSize: 24,
  },

  mainPostButton: {
    marginTop: theme.spacing.lg,
  },
});
