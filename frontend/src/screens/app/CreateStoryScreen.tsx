import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/common/Button";
import { theme } from "@/constants/theme";
import { useStory } from "@/hooks/useStory";

const { width, height } = Dimensions.get("window");

export const CreateStoryScreen = () => {
  const router = useRouter();
  const { createStory } = useStory();

  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");

  const pickImage = async () => {
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setMediaUri(result.assets[0].uri);
        setMediaType("image");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

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
        videoMaxDuration: 30, // 30 seconds max for stories
      });

      if (!result.canceled && result.assets[0]) {
        setMediaUri(result.assets[0].uri);
        setMediaType("video");
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need camera access");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setMediaUri(result.assets[0].uri);
        setMediaType("image");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handlePost = async () => {
    if (!mediaUri) {
      Alert.alert("No Media", "Please select a photo or video");
      return;
    }

    // In production, upload to cloud storage first
    const mockMediaUrl = `https://example.com/stories/${Date.now()}.${
      mediaType === "image" ? "jpg" : "mp4"
    }`;

    try {
      await createStory.mutateAsync({
        mediaUrl: mockMediaUrl,
        mediaType,
        caption,
        duration: mediaType === "video" ? 15 : undefined,
      });

      Alert.alert("Success", "Story posted successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create story"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Preview Area */}
      <View style={styles.previewContainer}>
        {mediaUri ? (
          <>
            <Image
              source={{ uri: mediaUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />

            {/* Caption Overlay */}
            {caption && (
              <View style={styles.captionOverlay}>
                <Text style={styles.captionText}>{caption}</Text>
              </View>
            )}

            {/* Top Actions */}
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.topButton}
                onPress={() => setMediaUri(null)}
              >
                <Text style={styles.topButtonText}>✕</Text>
              </TouchableOpacity>

              <View style={styles.topButtonsRight}>
                <TouchableOpacity style={styles.topButton}>
                  <Text style={styles.topButtonIcon}>🎨</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton}>
                  <Text style={styles.topButtonIcon}>Aa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton}>
                  <Text style={styles.topButtonIcon}>🎵</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyText}>Choose media to start</Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {mediaUri && (
          <View style={styles.captionInputContainer}>
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor={theme.colors.textSecondary}
              value={caption}
              onChangeText={setCaption}
              maxLength={200}
            />
            <Text style={styles.captionCounter}>{caption.length}/200</Text>
          </View>
        )}

        {!mediaUri ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionCard} onPress={takePhoto}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>📷</Text>
              </View>
              <Text style={styles.actionTitle}>Camera</Text>
              <Text style={styles.actionSubtitle}>Take a photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={pickImage}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>🖼️</Text>
              </View>
              <Text style={styles.actionTitle}>Photo</Text>
              <Text style={styles.actionSubtitle}>From gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={pickVideo}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>🎬</Text>
              </View>
              <Text style={styles.actionTitle}>Video</Text>
              <Text style={styles.actionSubtitle}>Up to 30s</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.postButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <Button
              title="Share to Story"
              onPress={handlePost}
              loading={createStory.isPending}
              style={styles.postButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  previewContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    position: "relative",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  emptyPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },

  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },

  topActions: {
    position: "absolute",
    top: theme.spacing.lg,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  topButtonText: {
    color: theme.colors.text,
    fontSize: 24,
  },

  topButtonsRight: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },

  topButtonIcon: {
    fontSize: 20,
  },

  captionOverlay: {
    position: "absolute",
    bottom: theme.spacing.xxl,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },

  captionText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  bottomContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  captionInputContainer: {
    marginBottom: theme.spacing.md,
  },

  captionInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    minHeight: 60,
  },

  captionCounter: {
    textAlign: "right",
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },

  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between",
  },

  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },

  actionIcon: {
    fontSize: 32,
  },

  actionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },

  actionSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },

  postButtonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
  },

  cancelButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },

  postButton: {
    flex: 1,
  },
});
