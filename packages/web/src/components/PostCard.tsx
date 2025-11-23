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
    <div className="p-4 w-full">
      <div className="flex flex-row items-center justify-between w-full gap-2">

        <Link href={`/posts/${post.id}`}>
          <h2 className="text-4xl font-bold">{post.title}</h2>
        </Link>
        {post.published
          ? <span className="bg-green-700 text-white px-4 py-2 rounded-full">Published</span>
          : <span className="bg-gray-700 text-white px-4 py-2 rounded-full">Draft</span>
        }
      </div>

      {post.content && (
        <p className="mt-2 text-xl text-gray-600">
          {/* TODO: Truncate content to preview length */}
          {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
        </p>
      )}

      <div className="mt-4 text-sm text-gray-500">

        {post.author &&
          <div className="flex items-center gap-2 ">
            <img src={post.author.avatar || ''} alt="Avatar" className="w-10 h-10 rounded object-cover" />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{post.author.name}</span>
              <span className="font-semibold text-md">{post.author.email}</span>
            </div>
          </div>
        }

        {post._count && (
          <span className="flex items-center gap-2">
            {post._count.likes} likes • {post._count.comments} comments
          </span>
        )}
      </div>


    </div>
  );
}
