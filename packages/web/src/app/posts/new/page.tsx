/**
 * Create Post Page
 * 
 * Form for creating a new blog post.
 * 
 * TODO: Implement actual UI design
 * - Add rich text editor (e.g., TipTap, Quill)
 * - Add image upload
 * - Add draft saving
 * - Add preview mode
 * - Add tags/categories
 * - Protect route (require authentication)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsService } from '@/lib/api/services';
import { useAuth } from '@/contexts/AuthContext';
import { PostType } from '@/lib/api/types';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PostType>('POST');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // TODO: Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <p>Please login to create a post</p>
        <a href="/login">Go to login</a>
      </div>
    );
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as PostType);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const post = await postsService.create({
        title,
        content,
        type,
        published,
        authorId: user!.id,
      });

      router.push(`/posts/${post.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Add proper styling */}

        <div>
          <label htmlFor="title" className="block font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="type" className="block font-medium mb-2">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={handleTypeChange}
            required
            className="border p-2 w-full rounded"
            disabled={isLoading}
          >
            <option value="POST">Post</option>
            <option value="PHOTO">Photo</option>
          </select>
        </div>
        <div>
          <label htmlFor="content" className="block font-medium mb-2">
            Content
          </label>
          {/* TODO: Replace with rich text editor */}
          {type === "POST" ? <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="border p-2 w-full rounded"
            disabled={isLoading}
          /> : <input
            id="content"
            value={content}
            onChange={(e) => {
              console.log(e.target.value);
              setContent(e.target.value);
            }}
            className="border p-2 w-full rounded"
            disabled={isLoading}
          />}
        </div>

        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="mr-2"
            disabled={isLoading}
          />
          <label htmlFor="published">
            Publish immediately
          </label>
        </div>

        {/* TODO: Style error message */}
        {error && <div className="text-red-500">{error}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="border px-6 py-2 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
