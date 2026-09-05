import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Leaf, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setTokens } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      setTokens(data.accessToken, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10">
      <Card className="max-w-md w-full p-8 border-earth-border space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center mx-auto text-earth-primary-light">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-earth-text">Welcome Back to Grevia</h2>
          <p className="text-xs text-earth-muted">Log in to continue your climate learning path</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="student@grevia.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} className="w-full space-x-2">
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Button>
        </form>

        <div className="text-center text-xs text-earth-muted pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-earth-primary-light font-bold hover:underline">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
};
