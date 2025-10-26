import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

interface MenuItem {
  icon: string;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}

export const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout.mutateAsync();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "person-circle-outline",
      label: "Account",
      onPress: () => Alert.alert("Account", "Account settings coming soon"),
    },
    {
      icon: "calendar-outline",
      label: "Your Booking",
      onPress: () => Alert.alert("Bookings", "Your bookings coming soon"),
    },
    {
      icon: "checkmark-circle-outline",
      label: "Refunds",
      onPress: () => Alert.alert("Refunds", "Refunds coming soon"),
    },
    {
      icon: "bookmark-outline",
      label: "Favourite Venues",
      onPress: () => Alert.alert("Favourites", "Favourite venues coming soon"),
    },
    {
      icon: "headset-outline",
      label: "Support",
      onPress: () => Alert.alert("Support", "Support coming soon"),
    },
    {
      icon: "lock-closed-outline",
      label: "Privacy Policy",
      onPress: () => Alert.alert("Privacy", "Privacy policy coming soon"),
    },
    {
      icon: "shield-checkmark-outline",
      label: "Terms of use",
      onPress: () => Alert.alert("Terms", "Terms of use coming soon"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={["#E8F5E9", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {(user?.firstName || "")[0]?.toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </View>

          {/* User Info */}
          <Text style={styles.userName}>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.username || "User"}
          </Text>
          {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
        </LinearGradient>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        {/* Bottom nav will be rendered by parent */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  profileImageContainer: {
    marginBottom: theme.spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  userName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  menuContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: theme.spacing.md,
  },
  logoutText: {
    fontSize: theme.fontSize.md,
    color: "#FF3B30",
    fontWeight: theme.fontWeight.semibold,
  },
  bottomNavContainer: {
    height: 0, // Will be taken by BottomNavigation component
  },
});
