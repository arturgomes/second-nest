/**
 * Login Page
 * 
 * Displays the login form for user authentication.
 * 
 * TODO: Implement actual UI design
 * - Add background styling
 * - Add logo/branding
 * - Add link to registration page
 * - Add social login options
 */

import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-8">Login</h1>

      {/* TODO: Add styling and layout */}
      <LoginForm />

      {/* TODO: Add link to registration */}
      <p className="mt-4 text-center text-gray-600">
        Don't have an account? <a href="/register" className="text-blue-500">Register</a>
      </p>
    </div>
  );
}
