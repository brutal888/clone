import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Play, LogOut, Home, Film, Search, Bell } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Layout() {
  const { isAdmin, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center text-red-600">
                <Play className="w-8 h-8" />
                <span className="text-xl font-bold text-white ml-2">Brutuflix</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/browse" 
                  className={`text-sm ${location.pathname === '/browse' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link 
                  to="/browse" 
                  className="text-sm text-gray-300 hover:text-white"
                >
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4" />
                    <span>Movies</span>
                  </div>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`text-sm ${location.pathname === '/admin' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    Admin
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-gray-300 hover:text-white">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-300 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-300 hover:text-white px-3 py-2"
              >
                <LogOut className="w-5 h-5" />
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