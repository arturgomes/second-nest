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

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { PostType } from '@/lib/api/types';
import { useCreatePostMutation } from '@/lib/store/api/postsApi';

interface CreatePostFormData {
  title: string;
  type: PostType;
  content: string;
  photoUrl: string;
  published: boolean;
}

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [createPost, { isLoading, error }] = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    defaultValues: {
      title: '',
      type: 'POST',
      content: '',
      photoUrl: '',
      published: false,
    },
  });

  const type = watch('type');

  // TODO: Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <p>Please login to create a post</p>
        <a href="/login">Go to login</a>
      </div>
    );
  }

  const onSubmit: SubmitHandler<CreatePostFormData> = async (data) => {
    try {
      const finalContent = data.type === 'POST' ? data.content : data.photoUrl;

      const post = await createPost({
        title: data.title,
        type: data.type,
        content: finalContent,
        published: data.published,
        authorId: user!.id,
      }).unwrap();

      router.push(`/posts/${post.id}`);
    } catch (err: unknown) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* TODO: Add proper styling */}

        <div>
          <label htmlFor="title" className="block font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="border p-2 w-full rounded"
            disabled={isLoading}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="type" className="block font-medium mb-2">
            Type
          </label>
          <select
            id="type"
            {...register('type')}
            className="border p-2 w-full rounded"
            disabled={isLoading}
          >
            <option value="POST">Post</option>
            <option value="PHOTO">Photo</option>
          </select>
        </div>
        <div>
          <label htmlFor={type === "POST" ? "content-textarea" : "content-input"} className="block font-medium mb-2">
            Content
          </label>
          {/* TODO: Replace with rich text editor */}
          {type === "POST" ? (
            <textarea
              key="content-textarea"
              id="content-textarea"
              {...register('content', { required: type === 'POST' ? 'Content is required' : false })}
              rows={10}
              className="border p-2 w-full rounded"
              disabled={isLoading}
            />
          ) : (
            <input
              key="content-input"
              id="content-input"
              type="text"
              placeholder="Enter photo URL..."
              {...register('photoUrl', { required: type === 'PHOTO' ? 'Photo URL is required' : false })}
              className="border p-2 w-full rounded relative z-10 bg-transparent"
              disabled={isLoading}
            />
          )}
          {errors.content && type === 'POST' && (
            <span className="text-red-500 text-sm">{errors.content.message}</span>
          )}
          {errors.photoUrl && type === 'PHOTO' && (
            <span className="text-red-500 text-sm">{errors.photoUrl.message}</span>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            {...register('published')}
            className="mr-2"
            disabled={isLoading}
          />
          <label htmlFor="published">
            Publish immediately
          </label>
        </div>

        {/* TODO: Style error message */}
        {error && (
          <div className="text-red-500">
            {'message' in error ? String(error.message) : 'Failed to create post'}
          </div>
        )}

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
