/**
 * Navigation Component (MOCKED)
 * 
 * TODO: Implement actual UI design
 * 
 * This is a placeholder showing the navigation structure.
 * You should implement proper styling and responsive design.
 * 
 * Suggested improvements:
 * - Add Tailwind CSS styling
 * - Add mobile menu (hamburger)
 * - Add active link highlighting
 * - Add user dropdown menu
 * - Add search bar
 * - Add notifications badge
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b p-4">
      {/* TODO: Add proper styling */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link href="/" className="font-bold">
            Blog
          </Link>
          <Link href="/posts">Posts</Link>
        </div>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/posts/new">Create Post</Link>
              <span>Welcome, {user?.name || user?.email}</span>
              <button onClick={logout} className="text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
