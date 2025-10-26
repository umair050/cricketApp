import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { theme } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { useAppStore } from "@/store/appStore";

interface Country {
  code: string;
  name: string;
  flag: string;
}

export const SelectCountryScreen = () => {
  const router = useRouter();
  const { countries, updateProfile } = useUser();
  const { setOnboardingStep } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const filteredCountries =
    countries.data?.data?.filter((country: Country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleContinue = async () => {
    if (!selectedCountry) return;

    try {
      await updateProfile.mutateAsync({ country: selectedCountry.name });
      setOnboardingStep(1);
      router.push("/(onboarding)/fill-profile");
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        selectedCountry?.code === item.code && styles.countryItemSelected,
      ]}
      onPress={() => setSelectedCountry(item)}
    >
      <View style={styles.countryInfo}>
        <Text style={styles.flag}>{item.flag}</Text>
        <Text style={styles.countryName}>{item.name}</Text>
      </View>
      <View
        style={[
          styles.radio,
          selectedCountry?.code === item.code && styles.radioSelected,
        ]}
      >
        {selectedCountry?.code === item.code && (
          <View style={styles.radioDot} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (countries.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Select Your Country</Text>

        <Input
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          leftIcon={<Text>🔍</Text>}
          containerStyle={styles.searchInput}
        />

        <FlatList
          data={filteredCountries}
          renderItem={renderCountryItem}
          keyExtractor={(item) => item.code}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedCountry}
          loading={updateProfile.isPending}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: theme.spacing.lg,
  },

  searchInput: {
    marginBottom: theme.spacing.md,
  },

  listContent: {
    paddingBottom: theme.spacing.lg,
  },

  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: "transparent",
  },

  countryItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },

  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },

  countryName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: theme.colors.primary,
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },

  continueButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});
