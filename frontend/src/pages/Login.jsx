import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ink flex items-center justify-center px-4 py-12">
      <div className="bg-charcoal border border-stone/20 rounded-lg p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block font-display text-gold text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            CampusConnect
          </Link>
          <p className="text-stone text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full bg-ink/70 border border-stone/30 text-ivory placeholder-stone/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-ink/70 border border-stone/30 text-ivory placeholder-stone/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-3"
            >
              {isSubmitting ? 'Signing In...' : 'Login'}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-stone mt-6">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-gold font-medium hover:underline hover:text-gold-bright transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
