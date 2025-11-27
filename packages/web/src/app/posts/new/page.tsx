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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { PostType } from '@/lib/api/types';
import { useCreatePostMutation } from '@/lib/store/api/postsApi';
import { CsvFileUpload } from '@/components/csv-upload/file-upload';
import { ImportProgress } from '@/components/csv-upload/progress-tracker';
import { io } from 'socket.io-client';

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
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  // CSV Import State
  const [importJob, setImportJob] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    // In a real app, this URL should come from env
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && importJob) {
      socket.on('import:progress', (data: any) => {
        if (data.importJobId === importJob.id) {
          setImportJob((prev: any) => ({ ...prev, ...data }));
        }
      });
    }
  }, [socket, importJob]);

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

  if (!isAuthenticated) {
    router.push('/login');
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

  const handleCsvUpload = async (file: File) => {
    if (!user) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    try {
      // TODO: Use RTK Query or Axios instance with auth headers
      const response = await fetch('http://localhost:3000/import/csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const job = await response.json();
      setImportJob(job);
    } catch (err) {
      console.error('Upload error:', err);
      // Show error toast
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'single'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setActiveTab('single')}
        >
          Single Post
        </button>
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'batch'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setActiveTab('batch')}
        >
          Batch Import (CSV)
        </button>
      </div>

      {activeTab === 'single' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex justify-center items-center p-4 border border-red-500 rounded w-full">
              <span className="text-red-500">{'message' in error ? String(error.message) : 'Failed to create post'}</span>
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
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-900 mb-2">CSV Format Instructions</h3>
            <p className="text-sm text-blue-800 mb-2">
              Your CSV file should have the following headers:
            </p>
            <code className="block bg-white p-2 rounded text-xs text-gray-700 border border-blue-200">
              title,content,type,published
            </code>
          </div>

          <CsvFileUpload onFileSelect={handleCsvUpload} disabled={!!importJob && importJob.status === 'PROCESSING'} />

          {importJob && (
            <ImportProgress
              status={importJob.status}
              processed={importJob.processed}
              total={importJob.total}
              errors={importJob.errors}
            />
          )}
        </div>
      )}
    </div>
  );
}
