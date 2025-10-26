import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, CreatePostData } from '@/services/postService';

export const usePost = () => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts(1, 10),
  });

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    posts: postsQuery,
    createPost: createPostMutation,
  };
};

