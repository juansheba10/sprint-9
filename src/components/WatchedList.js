import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { db } from '../Firebase/script';
import { collection, where, getDocs, query } from 'firebase/firestore';

const Watchedlist = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [watchedlistMovies, setWatchedtlistMovies] = useState([]);
  const [showThumbnails, setShowThumbnails] = useState(false);

  useEffect(() => {
    const fetchWatchedlistMovies = async () => {
      const userId = user.uid;
      const watchedlistQuery = query(collection(db, 'watchedlist'), where('userId', '==', userId));
      const watchedlistDocs = await getDocs(watchedlistQuery);
        
      let movies = [];
      watchedlistDocs.forEach((doc) => {
        movies.push(doc.data());
      });
      setWatchedtlistMovies(movies);
    }

    fetchWatchedlistMovies();
  }, [user]);

  return (
    <div>
      <button
        className="my-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
        onClick={() => setShowThumbnails(!showThumbnails)}
      >
        {showThumbnails ? 'Ocultar Películas ya vistas' : 'Mostrar Películas ya vistas'}
      </button>
      {showThumbnails && watchedlistMovies.map(movie => (
        <div key={movie.movieId} className="flex gap-x-4">
          <img
            className="h-12 w-12 flex-none rounded-full bg-gray-50" 
            src={`https://image.tmdb.org/t/p/w500${movie.moviePoster}`} 
            alt={movie.movieTitle} 
          />
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900">{movie.movieTitle}</p>
            {/* asumimos que movie.movieDescription existe, si no, tendrías que cambiarlo por el campo correcto */}
            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{movie.movieDescription}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Watchedlist;
