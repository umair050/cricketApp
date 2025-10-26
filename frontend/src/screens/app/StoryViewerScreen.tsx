import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { theme } from "@/constants/theme";
import { useStory } from "@/hooks/useStory";

const { width, height } = Dimensions.get("window");
const STORY_DURATION = 5000; // 5 seconds per story

export const StoryViewerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { viewStory, deleteStory, stories } = useStory();

  const [currentUserIndex, setCurrentUserIndex] = useState(
    parseInt(params.userIndex as string) || 0
  );
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const progressAnims = useRef<Animated.Value[]>([]).current;
  const currentProgressRef = useRef<Animated.CompositeAnimation | null>(null);

  const usersData = stories.data?.data || [];
  const currentUserData = usersData[currentUserIndex];
  const currentUserStories = currentUserData?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];

  // Initialize progress animations
  useEffect(() => {
    if (currentUserStories.length > 0) {
      progressAnims.length = 0;
      currentUserStories.forEach(() => {
        progressAnims.push(new Animated.Value(0));
      });
    }
  }, [currentUserIndex]);

  // Auto-play story
  useEffect(() => {
    if (!currentStory || isPaused) return;

    const anim = Animated.timing(progressAnims[currentStoryIndex], {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    currentProgressRef.current = anim;
    anim.start(({ finished }) => {
      if (finished) {
        goToNextStory();
      }
    });

    // Mark as viewed
    if (currentStory && !currentStory.isViewed) {
      viewStory.mutate(currentStory.id);
    }

    return () => {
      anim.stop();
    };
  }, [currentStory, currentStoryIndex, isPaused]);

  const goToNextStory = () => {
    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      progressAnims[currentStoryIndex].setValue(1);
    } else {
      goToNextUser();
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      progressAnims[currentStoryIndex].setValue(0);
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      goToPreviousUser();
    }
  };

  const goToNextUser = () => {
    if (currentUserIndex < usersData.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      router.back();
    }
  };

  const goToPreviousUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(0);
    }
  };

  const handleTapLeft = () => {
    goToPreviousStory();
  };

  const handleTapRight = () => {
    goToNextStory();
  };

  const handleLongPress = () => {
    setIsPaused(true);
    currentProgressRef.current?.stop();
  };

  const handlePressRelease = () => {
    setIsPaused(false);
  };

  const handleDeleteStory = () => {
    Alert.alert("Delete Story", "Are you sure you want to delete this story?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteStory.mutateAsync(currentStory.id);
            if (currentUserStories.length === 1) {
              router.back();
            } else {
              goToNextStory();
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete story");
          }
        },
      },
    ]);
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 50;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          goToPreviousUser();
        } else if (gestureState.dx < -50) {
          goToNextUser();
        }
      },
    })
  ).current;

  if (!currentStory) {
    return null;
  }

  const isOwnStory = currentUserData?.user?.id === stories.data?.currentUserId;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.storyContainer} {...panResponder.panHandlers}>
        {/* Story Media */}
        <Image
          source={{ uri: currentStory.mediaUrl }}
          style={styles.storyImage}
          resizeMode="cover"
        />

        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {currentUserStories.map((_, index) => (
            <View key={index} style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnims[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUserData?.user?.fullName?.[0] ||
                  currentUserData?.user?.username?.[0] ||
                  "U"}
              </Text>
            </View>
            <View>
              <Text style={styles.username}>
                {currentUserData?.user?.fullName ||
                  currentUserData?.user?.username ||
                  "Anonymous"}
              </Text>
              <Text style={styles.time}>
                {getTimeAgo(new Date(currentStory.createdAt))}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            {isOwnStory && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDeleteStory}
              >
                <Text style={styles.headerIcon}>🗑️</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Text style={styles.headerIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Caption */}
        {currentStory.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>{currentStory.caption}</Text>
          </View>
        )}

        {/* Tap Areas */}
        <View style={styles.tapAreas}>
          <TouchableOpacity
            style={styles.tapAreaLeft}
            onPress={handleTapLeft}
            onLongPress={handleLongPress}
            onPressOut={handlePressRelease}
            activeOpacity={1}
          />
          <TouchableOpacity
            style={styles.tapAreaRight}
            onPress={handleTapRight}
            onLongPress={handleLongPress}
            onPressOut={handlePressRelease}
            activeOpacity={1}
          />
        </View>

        {/* View Count (for own stories) */}
        {isOwnStory && (
          <View style={styles.viewsContainer}>
            <Text style={styles.viewsIcon}>👁️</Text>
            <Text style={styles.viewsText}>
              {currentStory._count?.storyViews || 0}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  storyContainer: {
    flex: 1,
    position: "relative",
  },

  storyImage: {
    width: width,
    height: height,
  },

  progressContainer: {
    position: "absolute",
    top: 10,
    left: 8,
    right: 8,
    flexDirection: "row",
    gap: 4,
    zIndex: 10,
  },

  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
  },

  header: {
    position: "absolute",
    top: 20,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  username: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  time: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  headerActions: {
    flexDirection: "row",
    gap: 8,
  },

  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerIcon: {
    fontSize: 18,
  },

  captionContainer: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 10,
  },

  caption: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  tapAreas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },

  tapAreaLeft: {
    flex: 1,
  },

  tapAreaRight: {
    flex: 1,
  },

  viewsContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -40 }],
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  viewsIcon: {
    fontSize: 16,
  },

  viewsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
