/**
 * Posts Page
 * 
 * Displays a list of posts.
 * 
 * TODO: Implement actual UI design
 * - Add rich text rendering for content
 * - Add comment section
 * - Add like button
 * - Add edit/delete buttons (for post owner)
 * - Add share buttons
 * - Add related posts section
 */

'use client';

import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { useGetPostsQuery } from '@/lib/store/api/postsApi';
import { useToggleLikeMutation } from '@/lib/store/api/likesApi';

export default function PostPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useGetPostsQuery();
  const [toggleLike] = useToggleLikeMutation();

  const posts = data?.data || [];

  async function handleLike(postId: string) {
    if (user) {
      try {
        await toggleLike({ postId, userId: user.id });
      } catch (err) {
        console.error('Failed to toggle like:', err);
      }
    }
  }

  if (isLoading) {
    return <div className="text-gray-500">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error loading post</p>
        <p className="text-sm">{'message' in error ? String(error.message) : 'Failed to load posts'}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="text-gray-500">Post not found</div>;
  }

  return (
    <article className="flex flex-col gap-4 max-w-lg mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
      ))}
    </article>
  );
}
