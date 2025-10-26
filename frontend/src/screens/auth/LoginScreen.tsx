import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { SocialButton } from "@/components/common/SocialButton";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

const socialButtons = [
  { provider: "facebook" as const, color: "#1877F2", icon: "logo-facebook" },
  { provider: "google" as const, color: "#DB4437", icon: "logo-google" },
  { provider: "apple" as const, color: "#000000", icon: "logo-apple" },
];

export const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login.mutateAsync({ email, password });
      router.replace("/(app)/home");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Coming Soon", `${provider} login will be available soon`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>LIVE</Text>
            <Text style={styles.subtitle}>Let's you in</Text>
          </View>

          {/* Email/Password Form */}
          <View style={styles.form}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            <Button
              title="Sign in with password"
              onPress={handleLogin}
              loading={login.isPending}
              style={styles.signInButton}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              or Continue with Social Login
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <View style={styles.socialButtonsRow}>
              {socialButtons.map((social) => (
                <TouchableOpacity
                  key={social.provider}
                  style={[
                    styles.socialButton,
                    { backgroundColor: social.color },
                  ]}
                  onPress={() => handleSocialLogin(social.provider)}
                >
                  <Ionicons
                    name={social.icon as any}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: theme.spacing.xxl,
    paddingBottom:
      Platform.OS === "android" ? theme.spacing.xxl : theme.spacing.lg,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },

  logo: {
    fontSize: 48,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 8,
    marginBottom: theme.spacing.md,
  },

  subtitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },

  socialContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },

  socialTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    fontWeight: theme.fontWeight.semibold,
  },

  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.md,
  },

  socialButton: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.xl,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },

  dividerText: {
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.sm,
  },

  form: {
    marginBottom: theme.spacing.lg,
  },

  signInButton: {
    marginTop: theme.spacing.md,
  },

  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.lg,
    minHeight: 50,
  },

  signUpButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    minHeight: 44,
    justifyContent: "center",
  },

  signUpText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },

  signUpLink: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
});
