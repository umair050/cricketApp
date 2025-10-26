import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storyService, CreateStoryData } from '@/services/storyService';

export const useStory = () => {
  const queryClient = useQueryClient();

  const storiesQuery = useQuery({
    queryKey: ['stories'],
    queryFn: () => storyService.getStories(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const createStoryMutation = useMutation({
    mutationFn: (data: CreateStoryData) => storyService.createStory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const viewStoryMutation = useMutation({
    mutationFn: (storyId: string) => storyService.viewStory(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: (storyId: string) => storyService.deleteStory(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  return {
    stories: storiesQuery,
    createStory: createStoryMutation,
    viewStory: viewStoryMutation,
    deleteStory: deleteStoryMutation,
  };
};

