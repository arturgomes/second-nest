/**
 * Home Page
 * 
 * Displays a paginated list of blog posts.
 * 
 * TODO: Implement actual UI design
 * - Add loading skeleton
 * - Add error state UI
 * - Add pagination controls
 * - Add filter/search functionality
 * - Add post creation button (for authenticated users)
 */

import { PostCard } from '@/components/PostCard';
import { postsService } from '@/lib/api/services';

export default async function HomePage() {
  // Fetch posts on the server side
  // TODO: Add error handling
  const postsData = await postsService.getAll({ page: 1, limit: 10 });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      {/* TODO: Add loading state */}
      {/* TODO: Add empty state if no posts */}

      <div className="space-y-4">
        {postsData.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* TODO: Add pagination controls */}
      <div className="mt-8">
        <p className="text-gray-500">
          Showing {postsData.data.length} of {postsData.meta.total} posts
        </p>
      </div>
    </div>
  );
}
