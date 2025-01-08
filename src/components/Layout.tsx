import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Play, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Layout() {
  const { isAdmin, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-red-600">
                <Play className="w-8 h-8" />
                <span className="text-xl font-bold text-white ml-2">NetflixClone</span>
              </Link>
              <nav className="ml-8">
                <Link to="/browse" className="text-gray-300 hover:text-white px-3 py-2">
                  Browse
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2">
                    Admin
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-300 hover:text-white px-3 py-2"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}