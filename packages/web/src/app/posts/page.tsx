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

import { useEffect, useState } from 'react';
import { postsService } from '@/lib/api/services';
import type { PaginatedResponse, Post } from '@/lib/api/types';
import { PostCard } from '@/components/PostCard';

export default function PostPage() {

  const [posts, setPosts] = useState<PaginatedResponse<Post> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        setError(null);
        const postData = await postsService.getAll();
        setPosts(postData);
      } catch (err: any) {
        console.error('Failed to fetch post:', err);
        setError(err.message || 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, []);

  if (isLoading) {
    return <div className="text-gray-500">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error loading post</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!posts) {
    return <div className="text-gray-500">Post not found</div>;
  }

  return (
    <article className="flex flex-col gap-4">
      {posts.data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </article>
  );
}
