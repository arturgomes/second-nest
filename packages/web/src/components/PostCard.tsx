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
import { useEffect, useState } from 'react';
import { likesService } from '@/lib/api/services/like.service';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
  const { user } = useAuth();
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) return;
      const hasLiked = await likesService.isLikedByUser(post.id, user?.id);
      setIsLikedByUser(hasLiked);
    };

    checkIfLiked();
  }, [post.likes, user]);
  return (
    <div className="p-4 w-full flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between w-full gap-2">

        <Link href={`/posts/${post.id}`}>
          <h2 className="text-4xl font-bold">{post.title}</h2>
        </Link>
        {post.published
          ? <span className="bg-green-700 text-white px-4 py-2 rounded-full">Published</span>
          : <span className="bg-gray-700 text-white px-4 py-2 rounded-full">Draft</span>
        }
      </div>
      {
        post.content && post.type === 'POST' ? <p className="mt-2 text-xl text-gray-600">{post.content}</p> : <img src={post.content} alt={post.title} className="object-cover h-[500px] w-[500px]" />
      }


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

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            {post.likes?.length || 0} <LucideHeart fill={post.likes?.some((like) => like.userId === post.author?.id) ? 'red' : 'white'} className={post.likes?.some((like) => like.userId === post.author?.id) ? 'text-red-500' : 'text-gray-500'} onClick={() => onLike(post.id)} />
          </div>
          <div className="flex items-center gap-2">
            {post.comments?.length || 0} <LucideMessageCircle />
          </div>
        </div>
      </div>


    </div>
  );
}
