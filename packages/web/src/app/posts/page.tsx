/**
 * Virtualized Posts Feed with Infinite Scroll
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Uses @tanstack/react-virtual for DOM virtualization
 * - Only renders visible posts + overscan buffer
 * - Handles millions of posts efficiently
 * 
 * INFINITE SCROLL:
 * - Cursor-based pagination (Instagram-style)
 * - Automatic loading when scrolling near the end
 * - Like status included in initial query (no N+1 requests)
 * 
 * OPTIMISTIC UI UPDATES:
 * - Like/unlike updates UI immediately
 * - No refetch needed, uses local state
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { useGetPostsQuery } from '@/lib/store/api/postsApi';
import { useToggleLikeMutation } from '@/lib/store/api/likesApi';
import type { Post } from '@/lib/api/types';

const POSTS_PER_PAGE = 20;

export default function PostPage() {
  const { user } = useAuth();
  const parentRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  // Fetch initial posts
  const { data, isLoading, error, isFetching } = useGetPostsQuery({
    limit: POSTS_PER_PAGE,
    ...(cursor && { cursor }),
  });

  const [toggleLike] = useToggleLikeMutation();

  // Local state for optimistic updates
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  // Update local posts when data changes
  useEffect(() => {
    if (data?.data) {
      setLocalPosts(data.data);
    }
  }, [data]);

  const posts = localPosts;
  const nextCursor = data?.meta?.nextCursor;
  const hasNextPage = !!nextCursor;

  // Virtualizer for efficient rendering
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 600, // Estimated height of each post card
    overscan: 5, // Number of items to render outside visible area
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Infinite scroll: load more when near the end
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    // If we're near the end and there's more data, load it
    if (
      lastItem.index >= posts.length - 1 &&
      hasNextPage &&
      !isFetching
    ) {
      setCursor(nextCursor);
    }
  }, [virtualItems, posts.length, hasNextPage, isFetching, nextCursor]);

  async function handleLike(postId: string) {
    if (user) {
      // Optimistically update the UI
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              isLiked: !post.isLiked,
              _count: post._count
                ? {
                  ...post._count,
                  likes: post._count.likes + (post.isLiked ? -1 : 1),
                }
                : post._count,
            }
            : post
        )
      );

      try {
        await toggleLike({ postId, userId: user.id });
      } catch (err) {
        console.error('Failed to toggle like:', err);
        // Revert the optimistic update on error
        setLocalPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                ...post,
                isLiked: !post.isLiked,
                _count: post._count
                  ? {
                    ...post._count,
                    likes: post._count.likes + (post.isLiked ? 1 : -1),
                  }
                  : post._count,
              }
              : post
          )
        );
      }
    }
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading posts</p>
          <p className="text-sm">
            {'message' in error ? String(error.message) : 'Failed to load posts'}
          </p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No posts found</div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-screen overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const post = posts[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="max-w-lg mx-auto">
                <PostCard post={post} onLike={() => handleLike(post.id)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isFetching && (
        <div className="flex justify-center py-4">
          <div className="text-gray-500">Loading more posts...</div>
        </div>
      )}
    </div>
  );
}
