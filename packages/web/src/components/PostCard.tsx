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
import { LucideHeart, LucideMessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePublishPostMutation } from '@/lib/store/api/postsApi';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const { user } = useAuth();
  const [publishPost] = usePublishPostMutation();

  return (
    <div className="p-4 w-full flex flex-col gap-2">

      <div className="flex flex-col gap-2">
        {post.author &&
          <div className="flex items-center gap-2 ">
            <img src={post.author.avatar || ''} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{post.author.name}</span>
            </div>
          </div>
        }
        {
          post.content && post.type === 'POST' ? <p className="mt-2 text-xl text-gray-600">{post.content}</p> : <img src={post.content || ''} alt={post.title} className="object-cover h-[500px] w-[500px]" />
        }
      </div>
      <div className="flex flex-row items-center justify-between w-full gap-2">

        <Link href={`/posts/${post.id}`}>
          <h2 className="text-2xl font-bold">{post.title}</h2>
        </Link>
        {!post.published && <span className="bg-gray-700 text-white px-4 py-2 rounded-full" onClick={() => publishPost(post.id)}>Draft</span>}
      </div>

      <div className="text-sm text-gray-500">
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            {post.likes?.length || 0} <LucideHeart fill={post.isLiked ? 'red' : 'white'} className={post.isLiked ? 'text-red-500' : 'text-gray-500'} onClick={() => onLike(post.id)} />
          </div>
          <div className="flex items-center gap-2">
            {post.comments?.length || 0} <LucideMessageCircle />
          </div>
        </div>
      </div>


    </div>
  );
}
