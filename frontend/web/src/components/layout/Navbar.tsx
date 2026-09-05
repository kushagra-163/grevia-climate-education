import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Leaf, Award, BrainCircuit, Target, Trophy, User, LogOut, LayoutDashboard, Shield, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Quiz Engine', path: '/quiz', icon: BrainCircuit },
    { label: 'Eco-Coach AI', path: '/eco-coach', icon: Leaf },
    { label: 'Missions', path: '/missions', icon: Target },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  if (user?.role === 'admin' || user?.role === 'teacher') {
    navLinks.push({ label: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-earth-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-700 to-forest-500 p-0.5 shadow-md shadow-forest-800/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-earth-surface rounded-[10px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-earth-primary-light" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-earth-text font-black">
                GREVIA
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-earth-muted font-semibold">
                Climate Ed Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-earth-primary-soft text-earth-primary-light border border-earth-primary/30 font-semibold shadow-sm'
                        : 'text-earth-muted hover:text-earth-text hover:bg-earth-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'day' ? 'Night' : 'Day'} mode`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-earth-secondary border border-earth-border hover:border-earth-border-strong text-earth-text transition-all text-xs font-semibold"
              aria-label="Toggle Day or Night Theme"
            >
              {theme === 'day' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-600 fill-amber-500/20" />
                  <span className="hidden sm:inline">☀ Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-forest-400 fill-forest-400/20" />
                  <span className="hidden sm:inline">🌙 Night</span>
                </>
              )}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-earth-primary-soft border border-earth-primary/30 hover:border-earth-primary transition-colors"
                >
                  <Award className="w-4 h-4 text-earth-primary-light" />
                  <span className="text-xs font-bold text-earth-primary-light">{user.points} pts</span>
                </Link>

                <Link
                  to="/profile"
                  className="hidden sm:flex w-9 h-9 rounded-full bg-earth-secondary border border-earth-border items-center justify-center text-earth-muted hover:text-earth-text hover:border-earth-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="hidden sm:block p-2 text-earth-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-earth-muted hover:text-earth-text hover:bg-earth-secondary rounded-xl transition-colors"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-earth-muted hover:text-earth-text transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-earth-primary hover:bg-earth-primary-hover text-white rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-earth-border px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-earth-primary-soft text-earth-primary-light border border-earth-primary/30 font-semibold'
                    : 'text-earth-muted hover:text-earth-text hover:bg-earth-secondary'
                }`}
              >
                <Icon className="w-5 h-5 text-earth-primary-light" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-earth-border flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm text-earth-text font-medium"
            >
              <User className="w-4 h-4 text-earth-primary-light" />
              <span>{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
