import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

interface SocialButtonProps {
  provider: "facebook" | "google" | "apple";
  onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
}) => {
  const getProviderDetails = () => {
    switch (provider) {
      case "facebook":
        return {
          icon: "logo-facebook" as const,
          label: "Facebook",
          color: "#1877F2",
        };
      case "google":
        return {
          icon: "logo-google" as const,
          label: "Google",
          color: "#DB4437",
        };
      case "apple":
        return {
          icon: "logo-apple" as const,
          label: "Apple",
          color: "#000000",
        };
      default:
        return {
          icon: "logo-google" as const,
          label: "Social",
          color: theme.colors.primary,
        };
    }
  };

  const { icon, label, color } = getProviderDetails();

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
});
