import { create } from 'zustand';

interface AppState {
  isOnboarding: boolean;
  onboardingStep: number;
  
  setIsOnboarding: (value: boolean) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnboarding: false,
  onboardingStep: 0,

  setIsOnboarding: (value) => set({ isOnboarding: value }),
  
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  
  completeOnboarding: () => set({ isOnboarding: false, onboardingStep: 0 }),
}));

