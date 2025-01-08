import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Play, Plus, Check } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Browse() {
  const [movies, setMovies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const { profile } = useAuthStore();

  useEffect(() => {
    loadMovies();
    loadCategories();
    loadWatchlist();
  }, []);

  async function loadMovies() {
    const { data } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });
    setMovies(data || []);
  }

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*');
    setCategories(data || []);
  }

  async function loadWatchlist() {
    if (!profile) return;
    const { data } = await supabase
      .from('watchlist')
      .select('movie_id')
      .eq('user_id', profile.id);
    setWatchlist(new Set(data?.map(item => item.movie_id)));
  }

  async function toggleWatchlist(movieId: string) {
    if (!profile) return;
    
    if (watchlist.has(movieId)) {
      await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', profile.id)
        .eq('movie_id', movieId);
      watchlist.delete(movieId);
    } else {
      await supabase
        .from('watchlist')
        .insert([{ user_id: profile.id, movie_id: movieId }]);
      watchlist.add(movieId);
    }
    setWatchlist(new Set(watchlist));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      {movies[0] && (
        <div className="relative h-[70vh] w-full">
          <div className="absolute inset-0">
            <img
              src={movies[0].thumbnail_url}
              alt={movies[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">{movies[0].title}</h1>
            <p className="text-lg mb-6">{movies[0].description}</p>
            <div className="flex gap-4">
              <Link
                to={`/watch/${movies[0].id}`}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded hover:bg-gray-200 transition"
              >
                <Play className="w-5 h-5" /> Play
              </Link>
              <button
                onClick={() => toggleWatchlist(movies[0].id)}
                className="flex items-center gap-2 px-8 py-3 bg-gray-500 bg-opacity-50 rounded hover:bg-opacity-70 transition"
              >
                {watchlist.has(movies[0].id) ? (
                  <><Check className="w-5 h-5" /> In Watchlist</>
                ) : (
                  <><Plus className="w-5 h-5" /> Add to Watchlist</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-8 py-12 space-y-12">
        {categories.map(category => (
          <div key={category.id}>
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map(movie => (
                <div key={movie.id} className="relative group">
                  <Link to={`/watch/${movie.id}`}>
                    <img
                      src={movie.thumbnail_url}
                      alt={movie.title}
                      className="w-full aspect-video object-cover rounded-md transition transform group-hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWatchlist(movie.id)}
                    className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    {watchlist.has(movie.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}