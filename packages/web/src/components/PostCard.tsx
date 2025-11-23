/**
 * PostCard Component (MOCKED)
 * 
 * TODO: Implement actual UI design
 * 
 * This is a placeholder component showing the structure.
 * You should implement the actual styling and layout.
 * 
 * Suggested improvements:
 * - Add Tailwind CSS classes for styling
 * - Add hover effects
 * - Add like button
 * - Add comment count badge
 * - Add author avatar
 * - Format dates nicely
 */

import Link from 'next/link';
import type { Post } from '@/lib/api/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="border p-4 rounded">
      {/* TODO: Add proper styling with Tailwind */}
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-xl font-bold">{post.title}</h2>
      </Link>

      {post.content && (
        <p className="mt-2 text-gray-600">
          {/* TODO: Truncate content to preview length */}
          {post.content.substring(0, 150)}...
        </p>
      )}

      <div className="mt-4 text-sm text-gray-500">
        {/* TODO: Add author info */}
        {post.author && <span>By {post.author.name || post.author.email}</span>}

        {/* TODO: Add like and comment counts */}
        {post._count && (
          <span className="ml-4">
            {post._count.likes} likes • {post._count.comments} comments
          </span>
        )}
      </div>

      {/* TODO: Add published badge if published */}
      {post.published && <span className="badge">Published</span>}
    </div>
  );
}
