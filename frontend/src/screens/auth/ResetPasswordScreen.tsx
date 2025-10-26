import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { theme } from "@/constants/theme";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export const ResetPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { code: string; newPassword: string }) =>
      authService.resetPassword(data),
    onSuccess: (response) => {
      setShowSuccess(true);
      // Auto-login after password reset
      setTimeout(() => {
        router.replace("/(app)/home");
      }, 2000);
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reset password"
      );
    },
  });

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({
      code: params.code as string,
      newPassword: password,
    });
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Congratulations!</Text>
          <Text style={styles.successMessage}>
            Your account is ready to use
          </Text>
          <Button
            title="Go to Homepage"
            onPress={() => router.replace("/(app)/home")}
            style={styles.successButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create New Password</Text>

          <Text style={styles.description}>Create Your New Password</Text>

          {/* Illustration placeholder */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustration}>
              <Text style={styles.illustrationIcon}>🔐</Text>
            </View>
          </View>

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Text>🔒</Text>}
            containerStyle={styles.input}
          />

          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={<Text>🔒</Text>}
            containerStyle={styles.input}
          />

          <Button
            title="Continue"
            onPress={handleResetPassword}
            loading={resetPasswordMutation.isPending}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },

  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },

  illustrationContainer: {
    alignItems: "center",
    marginVertical: theme.spacing.xl,
  },

  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  illustrationIcon: {
    fontSize: 80,
  },

  input: {
    marginBottom: theme.spacing.lg,
  },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },

  successIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
  },

  successIconText: {
    fontSize: 80,
    color: theme.colors.text,
  },

  successTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  successMessage: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },

  successButton: {
    width: "100%",
  },
});
