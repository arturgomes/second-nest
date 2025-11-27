/**
 * Home Page
 * 
 * Displays a paginated list of blog posts.
 * 
 * TODO: Implement actual UI design
 * - Add loading skeleton
 * - Add pagination controls
 * - Add filter/search functionality
 * - Add post creation button (for authenticated users)
 */

'use client';

import { PostCard } from '@/components/PostCard';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useGetPostsQuery, useClearAllPostsMutation } from '@/lib/store/api/postsApi';
import { useToggleLikeMutation } from '@/lib/store/api/likesApi';
import { Trash2 } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useGetPostsQuery({ page: 1, limit: 10 });
  const [toggleLike] = useToggleLikeMutation();
  const [clearAllPosts, { isLoading: isClearing }] = useClearAllPostsMutation();

  const posts = data?.data || [];
  const total = data?.meta.total || 0;

  async function handleLike(postId: string) {
    if (user) {
      try {
        await toggleLike({ postId, userId: user.id });
      } catch (err) {
        console.error('Failed to toggle like:', err);
      }
    }
  }

  async function handleClearAll() {
    if (window.confirm(`Are you sure you want to delete ALL ${total} posts? This cannot be undone!`)) {
      try {
        await clearAllPosts().unwrap();
      } catch (err) {
        console.error('Failed to clear posts:', err);
      }
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="flex gap-2">
          <button
            onClick={handleClearAll}
            disabled={isClearing || total === 0}
            className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
            title="Clear all posts (Development only)"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
          <Link href="/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Post</Link>
        </div>
      </div>

      {isLoading && (
        <div className="text-gray-500">Loading posts...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error loading posts</p>
          <p className="text-sm">{'message' in error ? String(error.message) : 'Failed to load posts'}</p>
          <p className="text-sm mt-2">
            Make sure the API server is running: <code className="bg-red-100 px-1">npm run dev:api</code>
          </p>
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <p className="text-gray-500">No posts yet. Create your first post!</p>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>

          <div className="mt-8">
            <p className="text-gray-500">
              Showing {posts.length} of {total} posts
            </p>
          </div>
        </>
      )}
    </div>
  );
}
