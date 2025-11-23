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

import { useEffect, useState } from 'react';
import { PostCard } from '@/components/PostCard';
import { postsService } from '@/lib/api/services';
import type { Post } from '@/lib/api/types';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const postsData = await postsService.getAll({ page: 1, limit: 10 });
        setPosts(postsData.data);
        setTotal(postsData.meta.total);
      } catch (err: any) {
        console.error('Failed to fetch posts:', err);
        setError(err.message || 'Failed to load posts. Make sure the API is running on http://localhost:3000');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      {isLoading && (
        <div className="text-gray-500">Loading posts...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error loading posts</p>
          <p className="text-sm">{error}</p>
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
              <PostCard key={post.id} post={post} />
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
