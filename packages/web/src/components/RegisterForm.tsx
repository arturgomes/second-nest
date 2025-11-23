/**
 * RegisterForm Component (MOCKED)
 * 
 * TODO: Implement actual UI design
 * 
 * This is a placeholder showing the form structure and API integration.
 * You should implement proper styling and error handling UI.
 * 
 * Suggested improvements:
 * - Add Tailwind CSS styling
 * - Add form validation with visual feedback
 * - Add password strength indicator
 * - Add password confirmation field
 * - Add loading state with spinner
 * - Add error message display
 * - Add success message and auto-redirect
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersService } from '@/lib/api/services';
import { useAuth } from '@/contexts/AuthContext';

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create the user
      await usersService.create({ email, password, name, avatar });

      // Auto-login after successful registration
      await login({ email, password });

      // Redirect to home
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TODO: Add proper styling */}

      <div>
        <label htmlFor="name" className="block">
          Name (optional)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="avatar" className="block">
          Avatar (optional)
        </label>
        <input
          id="avatar"
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="border p-2 w-full"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="email" className="block">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border p-2 w-full"
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500 mt-1">
          Minimum 6 characters
        </p>
      </div>

      {/* TODO: Style error message */}
      {error && <div className="text-red-500">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {isLoading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
