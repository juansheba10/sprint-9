import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Puff } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import {useAuth } from './AuthContext'; 

const MovieCard = ({ movie }) => {
  const { currentUser } = useAuth()
  const linkPath = currentUser ? `/movie/${movie.id}` : '/signIn';

  return (
    <Link to={linkPath} className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img className="w-full" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{movie.title}</div>
        <p className="text-gray-700 text-base">{movie.overview}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {movie.genre_ids.map(genre => (
          <span key={genre} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{genre}</span>
        ))}
      </div>
    </Link>
  );
};

const LandingPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=7be72508776961f3948639fbd796bccd`
                );
                setMovies(response.data.results);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Puff color="#00BFFF" height={100} width={100} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2>Error: {error}</h2>
            </div>
        );
    }

    return (
        <>
            <header className="text-center mt-10">
                <h1 className="text-4xl font-bold mb-4">¡Descubre y disfruta tus películas y series favoritas!</h1>
                <p className="text-lg mb-6">Explora y recibe recomendaciones personalizadas de películas y series según tus gustos y preferencias.</p>
            </header>
            <div className="flex flex-wrap justify-center">
                {movies.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>
        </>
    );
};

export default LandingPage;
