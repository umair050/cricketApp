import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select-country" />
      <Stack.Screen name="fill-profile" />
      <Stack.Screen name="follow-users" />
    </Stack>
  );
}
