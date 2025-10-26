import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { theme } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

export const FillProfileScreen = () => {
  const router = useRouter();
  const { updateProfile } = useUser();
  const { setOnboardingStep } = useAppStore();
  const { user } = useAuthStore();

  // Prefill form with data from signup
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Format date of birth if available
    if (user?.dateOfBirth) {
      setDateOfBirth(user.dateOfBirth);
    }
  }, [user]);

  const handleSelectImage = () => {
    // In a real app, you would use expo-image-picker here
    Alert.alert("Image Picker", "Image picker would open here");
  };

  const handleContinue = async () => {
    if (!firstName || !lastName || !username) {
      Alert.alert("Error", "Please fill in at least your name and username");
      return;
    }

    try {
      await updateProfile.mutateAsync({
        firstName,
        lastName,
        username,
        dateOfBirth: dateOfBirth || undefined,
        phoneNumber: phoneNumber || undefined,
        occupation: occupation || undefined,
        bio: bio || undefined,
        profileImage: profileImage || undefined,
      });
      setOnboardingStep(2);
      router.push("/(onboarding)/follow-users");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
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

          <Text style={styles.title}>Fill Your Profile</Text>

          {/* Profile Image */}
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleSelectImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>👤</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.nameField}>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Input
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Input
              placeholder="Occupation"
              value={occupation}
              onChangeText={setOccupation}
            />

            <Input
              placeholder="Bio (Optional)"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
            />
          </View>

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={updateProfile.isPending}
            style={styles.continueButton}
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
    paddingBottom: theme.spacing.xl,
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
    marginBottom: theme.spacing.xl,
  },

  imageContainer: {
    alignSelf: "center",
    marginBottom: theme.spacing.xl,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  imagePlaceholderIcon: {
    fontSize: 60,
  },

  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  editIcon: {
    fontSize: 16,
  },

  form: {
    marginBottom: theme.spacing.lg,
  },

  nameRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  nameField: {
    flex: 1,
  },

  continueButton: {
    marginTop: theme.spacing.md,
  },
});
