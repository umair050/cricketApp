import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { theme } from "@/constants/theme";

export const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => pathname === route;

  const navItems = [
    {
      name: "home",
      icon: "home",
      route: "/(app)/home",
    },
    {
      name: "discover",
      icon: "search-outline",
      route: "/(app)/discover-users",
    },
    {
      name: "create",
      icon: "add",
      route: "/(app)/create-post",
      isCenter: true,
    },
    {
      name: "messages",
      icon: "chatbubble-outline",
      route: "/(app)/messages",
    },
    {
      name: "profile",
      icon: "person-outline",
      route: "/(app)/profile",
    },
  ];

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <View style={styles.nav}>
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.addButton}>
                  <Ionicons
                    name={item.icon as any}
                    size={28}
                    color={theme.colors.text}
                  />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => router.push(item.route)}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={
                  isActive(item.route)
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: theme.spacing.sm,
    paddingBottom:
      Platform.OS === "android" ? theme.spacing.md : theme.spacing.sm,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
