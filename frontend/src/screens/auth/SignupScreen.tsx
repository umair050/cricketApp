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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/appStore";

export const SignupScreen = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const { setIsOnboarding, setOnboardingStep } = useAppStore();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (username.length > 20) {
      newErrors.username = "Username must be at most 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = new Date().getMonth() - dateOfBirth.getMonth();
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      newErrors.dateOfBirth = "You must be at least 13 years old";
    }

    if (!country) {
      newErrors.country = "Country is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      const formattedDate = dateOfBirth.toISOString().split("T")[0];

      // Store signup data for prefill in profile
      const signupData = {
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth: formattedDate,
        country,
      };

      await signup.mutateAsync({
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth: formattedDate,
        country,
        password,
      });

      // Store signup data in app store for profile prefilling
      setOnboardingStep(0);
      setIsOnboarding(true);

      // Navigate to fill profile screen
      router.replace("/(onboarding)/fill-profile");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Username */}
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              error={errors.username}
              autoCapitalize="none"
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            {/* First Name and Last Name */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  error={errors.firstName}
                />
              </View>
              <View style={styles.nameField}>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  error={errors.lastName}
                />
              </View>
            </View>

            {/* Email */}
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

            {/* Phone Number */}
            <Input
              placeholder="Phone Number (+1234567890)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              error={errors.phoneNumber}
              keyboardType="phone-pad"
              leftIcon={
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            {/* Date of Birth */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <Input
                  placeholder="Date of Birth"
                  value={formatDate(dateOfBirth)}
                  error={errors.dateOfBirth}
                  editable={false}
                  leftIcon={
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  }
                />
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setDateOfBirth(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}

            {/* Country */}
            <Input
              placeholder="Country"
              value={country}
              onChangeText={setCountry}
              error={errors.country}
              leftIcon={
                <Ionicons
                  name="flag-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            {/* Password */}
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
              title="Sign up"
              onPress={handleSignup}
              loading={signup.isPending}
              style={styles.signUpButton}
            />
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.signInLink}>Sign in</Text>
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
    paddingTop: theme.spacing.lg,
    paddingBottom:
      Platform.OS === "android" ? theme.spacing.xxl : theme.spacing.lg,
  },

  headerContainer: {
    paddingTop: Platform.OS === "android" ? theme.spacing.md : 0,
    marginBottom: theme.spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  header: {
    marginBottom: theme.spacing.xl,
  },

  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: 40,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },

  form: {
    marginBottom: theme.spacing.lg,
  },
  nameRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  nameField: {
    flex: 1,
  },

  signUpButton: {
    marginTop: theme.spacing.md,
  },

  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    minHeight: 50,
  },

  signInButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    minHeight: 44,
    justifyContent: "center",
  },

  signInText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },

  signInLink: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
});
