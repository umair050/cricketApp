import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = "CrikApp",
  showSearch = true,
  showNotifications = true,
  onSearchPress,
  onNotificationPress,
}) => {
  const router = useRouter();

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push("/(app)/discover-users");
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // Placeholder for notifications
      console.log("Notifications pressed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.icons}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearchPress}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        {showNotifications && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotificationPress}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  icons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
});
