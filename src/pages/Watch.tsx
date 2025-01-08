import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReactPlayer from 'react-player';
import { useAuthStore } from '../store/auth';

export default function Watch() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const { profile } = useAuthStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadMovie();
    loadProgress();
  }, [id]);

  async function loadMovie() {
    if (!id) return;
    const { data } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();
    setMovie(data);
  }

  async function loadProgress() {
    if (!id || !profile) return;
    const { data } = await supabase
      .from('watch_history')
      .select('progress')
      .eq('movie_id', id)
      .eq('user_id', profile.id)
      .single();
    if (data) setProgress(data.progress);
  }

  async function updateProgress(progress: number) {
    if (!id || !profile) return;
    await supabase
      .from('watch_history')
      .upsert([{
        user_id: profile.id,
        movie_id: id,
        progress: Math.floor(progress * 100),
      }]);
  }

  if (!movie) return null;

  return (
    <div className="h-screen bg-black">
      <ReactPlayer
        url={movie.video_url}
        width="100%"
        height="100%"
        controls
        playing
        progressInterval={10000}
        onProgress={({ played }) => updateProgress(played)}
        config={{
          file: {
            attributes: {
              crossOrigin: "anonymous"
            }
          }
        }}
      />
    </div>
  );
}