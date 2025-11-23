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
import { useParams, useRouter } from 'next/navigation';
import { postsService } from '@/lib/api/services';
import type { Post } from '@/lib/api/types';
import { likesService } from '@/lib/api/services/like.service';
import { useAuth } from '@/contexts/AuthContext';
import { commentsService } from '@/lib/api/services/comments.service';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
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

    if (id) {
      fetchPost();
    }
  }, [id]);

  async function handleLike() {
    if (user && post) {
      try {
        await likesService.toggle(post.id, user.id);
        const updatedPost = await postsService.getById(post.id);
        setPost(updatedPost);
      } catch (err) {
        console.error('Failed to toggle like:', err);
      }
    }
  }
  const handleCommentSubmit = async (content: string) => {
    if (!user || !post) return;

    try {
      const newComment = await commentsService.create({
        content,
        postId: post.id,
        authorId: user.id,
      });

      // Optimistically update the UI by adding the new comment to the post
      setPost({
        ...post,
        comments: [...(post.comments || []), { ...newComment, author: user }],
      });
    } catch (err: any) {
      console.error('Failed to create comment:', err);
      setError(err.message || 'Failed to create comment');
    }
  };

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
        <button className="border px-4 py-2 rounded" onClick={handleLike}>
          ❤️ Like ({post.likes?.length || 0})
        </button>
      </div>

      <CreateComment postId={post.id} onUpdate={handleCommentSubmit} />
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


export function CreateComment({ postId, onUpdate }: { postId: number, onUpdate: (content: string) => Promise<void> }) {
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
