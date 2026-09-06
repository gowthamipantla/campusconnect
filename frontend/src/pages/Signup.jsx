import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 1. Register account
      await register(formData);
      // 2. Automatically log in
      await login(formData.email, formData.password);
      // 3. Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message ||
        'Registration failed. Please try again.';
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
          <p className="text-stone text-sm mt-1">Create your university account</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Morgan"
              className="w-full bg-ink/70 border border-stone/30 text-ivory placeholder-stone/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-1.5"
            >
              University Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="alex.morgan@university.edu"
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
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-ink/70 border border-stone/30 text-ivory placeholder-stone/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="rollNumber"
              className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-1.5"
            >
              Roll Number / ID
            </label>
            <input
              id="rollNumber"
              name="rollNumber"
              type="text"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="e.g. 21CS042"
              className="w-full bg-ink/70 border border-stone/30 text-ivory placeholder-stone/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-1.5">
              Account Role
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect('STUDENT')}
                className={`py-2 px-3 text-sm font-semibold rounded-md border transition-colors cursor-pointer ${
                  formData.role === 'STUDENT'
                    ? 'bg-gold text-ink border-gold shadow-xs'
                    : 'bg-ink/60 text-ivory/80 border-stone/30 hover:border-gold/40'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`py-2 px-3 text-sm font-semibold rounded-md border transition-colors cursor-pointer ${
                  formData.role === 'ADMIN'
                    ? 'bg-gold text-ink border-gold shadow-xs'
                    : 'bg-ink/60 text-ivory/80 border-stone/30 hover:border-gold/40'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-3"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-stone mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-gold font-medium hover:underline hover:text-gold-bright transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
