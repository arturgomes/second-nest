/**
 * LoginForm Component (MOCKED)
 * 
 * TODO: Implement actual UI design
 * 
 * This is a placeholder showing the form structure and API integration.
 * You should implement proper styling and error handling UI.
 * 
 * Suggested improvements:
 * - Add Tailwind CSS styling
 * - Add form validation with visual feedback
 * - Add loading state with spinner
 * - Add error message display
 * - Add "Remember me" checkbox
 * - Add "Forgot password" link
 * - Add social login buttons
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push('/'); // Redirect to home after successful login
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TODO: Add proper styling */}

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
          className="border p-2 w-full"
          disabled={isLoading}
        />
      </div>

      {/* TODO: Style error message */}
      {error && <div className="text-red-500">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
