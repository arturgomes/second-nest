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

import { postsService } from '@/lib/api/services';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  // Fetch post on the server side
  // TODO: Add error handling
  let post;
  try {
    post = await postsService.getById(parseInt(id));
  } catch (error) {
    notFound();
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
        <button className="border px-4 py-2 rounded">
          ❤️ Like ({post._count?.likes || 0})
        </button>
      </div>

      {/* TODO: Add comments section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({post._count?.comments || 0})
        </h2>

        {/* TODO: Implement comment list */}
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded">
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {comment.author?.name || comment.author?.email}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}

        {/* TODO: Add comment form */}
      </div>
    </article>
  );
}
