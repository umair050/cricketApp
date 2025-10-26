import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authService, LoginData, SignupData } from '@/services/authService';

export const useAuth = () => {
  const { login: setAuth, logout: clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: async (response) => {
      await setAuth(response.data.user, response.data.token);
      queryClient.invalidateQueries();
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
    onSuccess: async (response) => {
      await setAuth(response.data.user, response.data.token);
      queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await clearAuth();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    login: loginMutation,
    signup: signupMutation,
    logout: logoutMutation,
  };
};

