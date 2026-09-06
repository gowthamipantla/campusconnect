import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'CLUB_COORDINATOR');

  const navLinks = [
    { name: 'Events', path: '/events' },
    isAdmin
      ? { name: 'Admin', path: '/admin' }
      : { name: 'Dashboard', path: '/dashboard' },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-ink text-ivory border-b border-charcoal/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-gold font-bold text-xl sm:text-2xl tracking-tight transition-opacity hover:opacity-90"
        >
          <span>CampusConnect</span>
        </Link>

        {/* Right: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm lg:text-base font-medium transition-colors duration-200 hover:text-gold ${
                    isActive ? 'text-gold' : 'text-ivory/90 hover:text-ivory'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-charcoal">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-ivory/80">
                  {user.name || user.email}
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-sm text-ivory hover:text-gold"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-ivory hover:text-gold"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    className="text-sm px-5 py-2"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-ivory hover:text-gold hover:bg-charcoal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsed Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal border-t border-charcoal/60 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'text-gold bg-ink/50 border-l-2 border-gold'
                      : 'text-ivory/90 hover:text-gold hover:bg-ink/30'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-charcoal/80 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-ivory/80">
                  {user.name || user.email}
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-ivory hover:text-gold"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className="w-full text-ivory justify-start px-3"
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
