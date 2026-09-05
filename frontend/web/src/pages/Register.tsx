import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserPlus, Leaf } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    age: '16',
    country: 'Global',
    city: 'Earth',
    language: 'en',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setTokens } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10) || 16,
      };
      const data = await authApi.signup(payload);
      setTokens(data.accessToken, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10">
      <Card className="max-w-lg w-full p-8 border-earth-border space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center mx-auto text-earth-primary-light">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-earth-text">Create Your Grevia Account</h2>
          <p className="text-xs text-earth-muted">Join the interactive climate learning network</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Alex Rivers"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="alex@grevia.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-muted uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-earth-surface border border-earth-border rounded-xl text-earth-text text-sm focus:outline-none focus:border-earth-primary"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </Button>
        </form>

        <div className="text-center text-xs text-earth-muted pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-earth-primary-light font-bold hover:underline">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
};
