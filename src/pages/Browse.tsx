import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Play, Plus, Check } from 'lucide-react';
import { useAuthStore } from '../store/auth';

const SAMPLE_MOVIES = [
  {
    id: '1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    thumbnail_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    video_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    release_year: 2010,
  },
  {
    id: '2',
    title: 'The Matrix',
    description: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    video_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    release_year: 1999,
  },
  {
    id: '3',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    thumbnail_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
    video_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    release_year: 2014,
  },
  {
    id: '4',
    title: 'Blade Runner 2049',
    description: 'A young blade runner\'s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.',
    thumbnail_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
    video_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    release_year: 2017,
  },
  {
    id: '5',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    thumbnail_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    video_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    release_year: 1994,
  }
];

const CATEGORIES = [
  { id: '1', name: 'Trending Now' },
  { id: '2', name: 'Popular on Netflix' },
  { id: '3', name: 'Sci-Fi Hits' },
  { id: '4', name: 'Award-Winning Films' }
];

export default function Browse() {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const { profile } = useAuthStore();

  useEffect(() => {
    loadWatchlist();
  }, []);

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
      <div className="relative h-[80vh] w-full">
        <div className="absolute inset-0">
          <img
            src={SAMPLE_MOVIES[0].thumbnail_url}
            alt={SAMPLE_MOVIES[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{SAMPLE_MOVIES[0].title}</h1>
          <p className="text-lg mb-6">{SAMPLE_MOVIES[0].description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/watch/${SAMPLE_MOVIES[0].id}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition"
            >
              <Play className="w-5 h-5" /> Play
            </Link>
            <button
              onClick={() => toggleWatchlist(SAMPLE_MOVIES[0].id)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 bg-opacity-50 rounded hover:bg-opacity-70 transition"
            >
              {watchlist.has(SAMPLE_MOVIES[0].id) ? (
                <><Check className="w-5 h-5" /> In Watchlist</>
              ) : (
                <><Plus className="w-5 h-5" /> Add to Watchlist</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 md:px-8 py-12 space-y-12">
        {CATEGORIES.map((category, index) => (
          <div key={category.id} className={index === 0 ? "-mt-32 relative z-10" : ""}>
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {SAMPLE_MOVIES.map((movie) => (
                <div key={movie.id} className="relative group">
                  <Link to={`/watch/${movie.id}`}>
                    <img
                      src={movie.thumbnail_url}
                      alt={movie.title}
                      className="w-full aspect-video object-cover rounded-md transition transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-sm font-bold">{movie.title}</h3>
                      <p className="text-xs text-gray-300">{movie.release_year}</p>
                    </div>
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

