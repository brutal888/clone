import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { Play } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setUser(data.user);
      navigate('/browse');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-90 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md bg-black bg-opacity-75 p-8 rounded-lg">
        <div className="flex items-center justify-center mb-8">
          <Play className="w-12 h-12 text-red-600" />
          <span className="text-2xl font-bold text-white ml-2">NetflixClone</span>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-4 rounded font-semibold hover:bg-red-700 transition"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-gray-400 text-center">
          New to NetflixClone?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}