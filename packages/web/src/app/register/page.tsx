/**
 * Register Page
 * 
 * Displays the registration form for new users.
 * 
 * TODO: Implement actual UI design
 * - Add background styling
 * - Add logo/branding
 * - Add link to login page
 * - Add terms of service checkbox
 * - Add social registration options
 */

import Link from 'next/link';
import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-8">Create Account</h1>

      {/* TODO: Add styling and layout */}
      <RegisterForm />

      {/* TODO: Add link to login */}
      <p className="mt-4 text-center text-gray-600">
        Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
}
