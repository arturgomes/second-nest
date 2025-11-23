/**
 * Post Detail Page
 * 
 * Displays a single post with comments and likes.
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
import { useParams } from 'next/navigation';
import { postsService } from '@/lib/api/services';
import type { Post } from '@/lib/api/types';
import { likesService } from '@/lib/api/services/like.service';
import { useAuth } from '@/contexts/AuthContext';

export default function PostPage() {
  const params = useParams();
  const { user } = useAuth();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        setError(null);
        const postData = await postsService.getById(parseInt(id));
        setPost(postData);
      } catch (err: any) {
        console.error('Failed to fetch post:', err);
        setError(err.message || 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    }

    if (id || isLoading) {
      fetchPost();
    }
  }, [id, isLoading]);

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

  if (!post) {
    return <div className="text-gray-500">Post not found</div>;
  }

  return (
    <article>
      {/* TODO: Add proper styling */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="text-gray-600 mb-8">
        {/* TODO: Add author info with avatar */}
        {post.author && (
          <span>By {post.author.name || post.author.email}</span>
        )}
        <span className="ml-4">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* TODO: Add rich text rendering */}
      <div className="prose max-w-none mb-8">
        {post.content}
      </div>

      {/* TODO: Add like button */}
      <div className="mb-8">
        <button className="border px-4 py-2 rounded" onClick={() => {
          user && likesService.toggle(post.id, user.id)
          setIsLoading(true)
        }}>
          ❤️ Like ({post.likes?.length || 0})
        </button>
      </div>

      {/* TODO: Add comments section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({post._count?.comments || 0})
        </h2>

        {/* TODO: Implement comment list */}
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded">
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {comment.author?.name || comment.author?.email}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}

        {/* TODO: Add comment form */}
      </div>
    </article>
  );
}
