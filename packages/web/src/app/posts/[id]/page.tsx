/**
 * Post Detail Page
 * 
 * Displays a single post with comments and likes.
 * 
 * TODO: Implement actual UI design
 * - Add rich text rendering for content
 */

'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PostCard } from '@/components/PostCard';
import { useGetPostByIdQuery } from '@/lib/store/api/postsApi';
import { useToggleLikeMutation } from '@/lib/store/api/likesApi';
import { useCreateCommentMutation } from '@/lib/store/api/commentsApi';
import { useState } from 'react';

export default function PostPage() {
  const params = useParams();
  const { user } = useAuth();
  const id = params.id as string;

  const { data: post, isLoading, error } = useGetPostByIdQuery(id, { skip: !id });
  const [toggleLike] = useToggleLikeMutation();
  const [createComment] = useCreateCommentMutation();

  async function handleLike() {
    if (user && post) {
      try {
        await toggleLike({ postId: post.id, userId: user.id });
      } catch (err) {
        console.error('Failed to toggle like:', err);
      }
    }
  }

  const handleCommentSubmit = async (content: string) => {
    if (!user || !post) return;

    try {
      await createComment({
        content,
        postId: post.id,
        authorId: user.id,
      });
      // RTK Query automatically refetches the post with updated comments
    } catch (err: any) {
      console.error('Failed to create comment:', err);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error loading post</p>
        <p className="text-sm">{'message' in error ? String(error.message) : 'Failed to load post'}</p>
      </div>
    );
  }

  if (!post) {
    return <div className="text-gray-500">Post not found</div>;
  }

  return (
    <article>
      <PostCard post={post} onLike={handleLike} />

      <CreateComment onUpdate={handleCommentSubmit} />
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({post.comments && post.comments.length || 0})
        </h2>

        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded">
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2 italic">
                  {comment.author?.name || comment.author?.email}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}
      </div>
    </article>
  );
}


export function CreateComment({ onUpdate }: { onUpdate: (content: string) => Promise<void> }) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setIsLoading(true);

    try {
      await onUpdate(content);
      // Clear the form after successful submission
      setContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to create comment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <p>Please login to create a post</p>
        <a href="/login">Go to login</a>
      </div>
    );
  }



  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Comment</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="content" className="block font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="border p-2 w-full rounded"
            disabled={isLoading}
          />
        </div>


        {error && <div className="text-red-500">{error}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            {isLoading ? 'Creating...' : 'Create Comment'}
          </button>


        </div>
      </form>
    </div>
  );
}
