import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UpdateProfileData } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';

export const useUser = () => {
  const queryClient = useQueryClient();
  const { updateUser: updateAuthUser } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: (response) => {
      updateAuthUser(response.data);
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const suggestionsQuery = useQuery({
    queryKey: ['user', 'suggestions'],
    queryFn: () => userService.getSuggestions(20),
  });

  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: () => userService.getCountries(),
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => userService.followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'suggestions'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (userId: string) => userService.unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'suggestions'] });
    },
  });

  return {
    profile: profileQuery,
    updateProfile: updateProfileMutation,
    suggestions: suggestionsQuery,
    countries: countriesQuery,
    follow: followMutation,
    unfollow: unfollowMutation,
    followUser: followMutation,
    unfollowUser: unfollowMutation,
  };
};

