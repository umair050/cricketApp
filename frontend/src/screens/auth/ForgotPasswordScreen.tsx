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
import { useRouter } from "expo-router";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { theme } from "@/constants/theme";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "code">("email");

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword({ email }),
    onSuccess: () => {
      setStep("code");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send reset code"
      );
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: (code: string) => authService.verifyResetCode({ code }),
    onSuccess: () => {
      router.push({
        pathname: "/(auth)/reset-password",
        params: { code: code.join("") },
      });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Invalid code");
    },
  });

  const handleSendCode = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    forgotPasswordMutation.mutate(email);
  };

  const handleVerifyCode = () => {
    const codeString = code.join("");
    if (codeString.length !== 6) {
      Alert.alert("Error", "Please enter the complete code");
      return;
    }
    verifyCodeMutation.mutate(codeString);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      // Focus next input (would need refs in real implementation)
    }
  };

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

          <Text style={styles.title}>Forgot Password</Text>

          {step === "email" ? (
            <>
              <Text style={styles.description}>
                Enter your email address and we'll send you a code to reset your
                password
              </Text>

              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Text>📧</Text>}
                containerStyle={styles.input}
              />

              <Button
                title="Send Code"
                onPress={handleSendCode}
                loading={forgotPasswordMutation.isPending}
              />
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Code has been sent to {email}
              </Text>

              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <View key={index} style={styles.codeInputContainer}>
                    <Text style={styles.codeInput}>{digit || "-"}</Text>
                  </View>
                ))}
              </View>

              {/* Simple code input */}
              <Input
                placeholder="Enter 6-digit code"
                value={code.join("")}
                onChangeText={(text) => {
                  const digits = text.slice(0, 6).split("");
                  const newCode = [
                    ...digits,
                    ...Array(6 - digits.length).fill(""),
                  ];
                  setCode(newCode);
                }}
                keyboardType="number-pad"
                maxLength={6}
                containerStyle={styles.input}
              />

              <Text style={styles.resendText}>
                Resend code in <Text style={styles.resendTimer}>0:55</Text>
              </Text>

              <Button
                title="Verify Code"
                onPress={handleVerifyCode}
                loading={verifyCodeMutation.isPending}
              />
            </>
          )}
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
    marginBottom: theme.spacing.md,
  },

  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },

  input: {
    marginBottom: theme.spacing.xl,
  },

  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },

  codeInputContainer: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  codeInput: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  resendText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xl,
  },

  resendTimer: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
});
