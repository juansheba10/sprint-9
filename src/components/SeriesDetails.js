import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import DefaultAvatar from "../components/Assets/3551739.jpg"

const SeriesDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({})

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=7be72508776961f3948639fbd796bccd`)
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error("Error fetching movie details:", error);
      });

    axios.get(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=7be72508776961f3948639fbd796bccd`)
      .then(response => {
        setReviews(response.data.results);
      })
      .catch(error => {
        console.error("Error fetching movie reviews:", error);
      });
  }, [id]);

  const handleExpandClick = (index) => {
    setExpandedReviews({
      ...expandedReviews,
      [index]: !expandedReviews[index],
    });
  };


  if (!movie) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-full mx-auto p-4 sm:p-8">
    <Link to="/" className="inline-block mb-4 text-blue-500">Back to movies</Link>
    <div className="flex flex-col sm:flex-row mb-4">
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full sm:w-1/2 sm:mr-4"/>
      <div>
      <h2 className="text-2xl font-semibold mb-2">{movie.name}</h2>
<p className="text-sm text-gray-500 mb-2">
  {movie.first_air_date ? movie.first_air_date.split('-')[0] : 'Unknown'} • 
  {movie.episode_run_time && movie.episode_run_time.length > 0 ? movie.episode_run_time[0] : 'Unknown'} min
</p>
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">Reviews:</h3>
      <div className="flex flex-wrap -m-2">
        {reviews.map((review, index) => (
          <div key={index} className="w-full sm:w-1/2 p-2">
            <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-start">
              <img src={
                review.author_details.avatar_path && review.author_details.avatar_path.startsWith('/https') 
                  ? review.author_details.avatar_path.replace(/^\//, '')
                  : review.author_details.avatar_path
                  ? `https://image.tmdb.org/tv/p/original${review.author_details.avatar_path}`
                  : DefaultAvatar} 
                alt={review.author} className="w-16 h-16 rounded-full mr-4 shadow" />
              <div>
                <div className="font-bold text-lg mb-2 text-gray-900 border-b">{review.author}</div>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedReviews[index] ? 'max-h-full' : 'max-h-20'}`}>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
                </div>
                {review.content.length > 220 && (
                   <button onClick={() => handleExpandClick(index)} className="mt-2 text-blue-500 hover:text-blue-600">{expandedReviews[index] ? 'Show less' : 'Show more'}</button>
                   )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Más detalles de la película aquí */}
  </div>
  
  );
};

export default SeriesDetails;