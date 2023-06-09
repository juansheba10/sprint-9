import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Puff } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SearchBar from './SearchBar';

const MovieCard = ({ movie }) => {
  const { currentUser } = useAuth();
  const linkPath = currentUser ? `/tv/${movie.id}` : '/signIn';

  return (
    <Link to={linkPath} className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img className="w-full" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{movie.name}</div>
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


const SeriesTv = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = `https://api.themoviedb.org/3/discover/tv?api_key=7be72508776961f3948639fbd796bccd&sort_by=vote_average.desc`;
        if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/tv?api_key=7be72508776961f3948639fbd796bccd&query=${encodeURIComponent(searchTerm)}`;
        }
        const response = await axios.get(url);

        console.log("API response:", response);

        // Filtrar los resultados para eliminar las series que no tengan un póster, título o descripción
        const completeMovies = response.data.results.filter(movie => 
          movie.poster_path && movie.name && movie.overview
        );
  
        // Añadir una declaración de depuración para ver las series después de filtrar
        console.log("Filtered movies:", completeMovies);
        setMovies(completeMovies);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm]);

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
    <div className="bg-gray-00">
      <header className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-4">¡Descubre y disfruta tus películas y series favoritas!</h1>
        <p className="text-lg mb-6">Explora y recibe recomendaciones personalizadas de películas y series según tus gustos y preferencias.</p>
        <SearchBar onSearch={setSearchTerm} /> {/* Pasar setSearchTerm como prop */}
      </header>
      <div className="flex flex-wrap justify-center">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
};

export default SeriesTv;
