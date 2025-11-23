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
              <div className="flex gap-2 flex-col items-start border border-gray-200 px-4 py-2 rounded-md bg-gray-50">

                {user &&
                  <div className="flex items-center gap-2 ">
                    {user?.avatar ?
                      <img src={user.avatar || ''} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                      : <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.name && <span className="text-xl p-2">{user?.name.split(' ').map((name) => name.charAt(0)).join('')}</span>}
                      </div>
                    }
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">{user?.name}</span>
                      <span className="font-semibold text-md">{user?.email}</span>
                    </div>
                  </div>
                }

              </div>
              <button onClick={logout} className="text-red-500 text-sm">
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
