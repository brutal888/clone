import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Film, Users, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'movies' | 'users'>('movies');
  const [movies, setMovies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    video_url: '',
    release_year: new Date().getFullYear(),
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    if (activeTab === 'movies') {
      const { data } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });
      setMovies(data || []);
    } else {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setUsers(data || []);
    }
  }

  async function handleAddMovie(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase
      .from('movies')
      .insert([newMovie]);
    
    if (!error) {
      setNewMovie({
        title: '',
        description: '',
        thumbnail_url: '',
        video_url: '',
        release_year: new Date().getFullYear(),
      });
      loadData();
    }
  }

  async function handleDeleteMovie(id: string) {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);
    
    if (!error) {
      loadData();
    }
  }

  async function handleDeleteUser(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (!error) {
      loadData();
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === 'movies' ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            <Film className="w-5 h-5" /> Movies
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === 'users' ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            <Users className="w-5 h-5" /> Users
          </button>
        </div>

        {activeTab === 'movies' ? (
          <div className="space-y-8">
            {/* Add Movie Form */}
            <form onSubmit={handleAddMovie} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Add New Movie</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="bg-gray-700 p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Release Year"
                  value={newMovie.release_year}
                  onChange={(e) => setNewMovie({ ...newMovie, release_year: parseInt(e.target.value) })}
                  className="bg-gray-700 p-2 rounded"
                  required
                />
                <input
                  type="url"
                  placeholder="Thumbnail URL"
                  value={newMovie.thumbnail_url}
                  onChange={(e) => setNewMovie({ ...newMovie, thumbnail_url: e.target.value })}
                  className="bg-gray-700 p-2 rounded"
                  required
                />
                <input
                  type="url"
                  placeholder="Video URL"
                  value={newMovie.video_url}
                  onChange={(e) => setNewMovie({ ...newMovie, video_url: e.target.value })}
                  className="bg-gray-700 p-2 rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  className="bg-gray-700 p-2 rounded md:col-span-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                <Plus className="w-5 h-5" /> Add Movie
              </button>
            </form>

            {/* Movies List */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Movies List</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map((movie) => (
                  <div key={movie.id} className="bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={movie.thumbnail_url}
                      alt={movie.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{movie.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">{movie.release_year}</span>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Users List</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="p-4">Display Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="p-4">{user.display_name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded ${
                          user.role === 'admin' ? 'bg-red-600' : 'bg-gray-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}