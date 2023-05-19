import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=7be72508776961f3948639fbd796bccd`)
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error("Error fetching movie details:", error);
      });

    axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=7be72508776961f3948639fbd796bccd`)
      .then(response => {
        setReviews(response.data.results);
      })
      .catch(error => {
        console.error("Error fetching movie reviews:", error);
      });
  }, [id]);

  if (!movie) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <Link to="/" className="inline-block mb-4 text-blue-500">Back to movies</Link>
      <div className="flex flex-col sm:flex-row mb-4">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full sm:w-64 sm:mr-4"/>
        <div>
          <h2 className="text-2xl font-semibold mb-2">{movie.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{movie.release_date.split('-')[0]} • {movie.runtime} min</p>
          <p className="text-gray-600">{movie.overview}</p>
          <p>Rating: {movie.vote_average} ({movie.vote_count} votes)</p>
        </div>
      </div>
      <div>
  <h3 className="text-xl font-semibold mb-2">Reviews:</h3>
  {reviews.map((review, index) => (
    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 flex">
      <img src={review.author_details.avatar_path.startsWith('/https') ? review.author_details.avatar_path.replace(/^\//, '') : `https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`} alt={review.author} className="w-16 h-16 rounded-full mr-4" />
      <div>
        <h4 className="font-bold text-lg mb-2">{review.author}</h4>
        <p className="text-gray-700">{review.content}</p>
      </div>
    </div>
  ))}
</div>




      {/* Más detalles de la película aquí */}
    </div>
  );
};

export default MovieDetails;
