import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "@/constants/theme";

interface AddStoryButtonProps {
  onPress?: () => void;
}

export const AddStoryButton: React.FC<AddStoryButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarWrapper}>
        <View style={styles.innerCircle}>
          <Text style={styles.plusIcon}>+</Text>
        </View>
      </View>
      <Text style={styles.label}>Your Story</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    fontSize: 28,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  label: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
