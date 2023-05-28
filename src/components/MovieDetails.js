import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import DefaultAvatar from "../components/Assets/3551739.jpg"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({})
  const [cast, setCast] = useState([]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=7be72508776961f3948639fbd796bccd`)
      .then(response => {
        console.log('Movie data:', response.data);
        if(response.data.vote_average > 10) {
          console.error(`Unexpected vote_average: ${response.data.vote_average}`);
        }
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
     axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=7be72508776961f3948639fbd796bccd`)
      .then(response => {
        setCast(response.data.cast);
      })
      .catch(error => {
        console.error("Error fetching movie cast:", error);
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
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full sm:w-1/2 sm:mr-4" />
        <div>
          <h2 className="text-2xl font-semibold mb-2">{movie.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{movie.release_date.split('-')[0]} • {movie.runtime} min</p>
          <p className="text-gray-600">{movie.overview}</p>
          <div>
            
            <p>Rating:</p>
            <div style={{ width: "100px", height: "100px" }}>
              {console.log(`Vote average before CircularProgressbar: ${movie.vote_average}`)}
              <CircularProgressbar 
  value={movie.vote_average * 10} 
  text={`${movie.vote_average * 10}%`} 
  styles={buildStyles({
    textSize: '16px',
    pathColor: `rgba(62, 152, 199, ${Math.min(movie.vote_average / 10, 1)})`,
    textColor: '#f88',
    trailColor: '#d6d6d6',
  })}
/>

            </div>
            <p>({movie.vote_count} votes)</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Cast:</h3>
            <div className="flex flex-wrap -m-2">
              {cast.slice(0, 5).map((actor, index) => (
                <div key={index} className="w-full sm:w-1/3 p-2">
                  <div className="bg-gray-200 p-4 rounded shadow-lg flex items-start">
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : DefaultAvatar}
                      alt={actor.name}
                      className="w-24 h-24 rounded-3xl mr-4 shadow"
                    />
                    <div>
                      <div className="font-bold text-lg mb-2 text-gray-900 border-b">{actor.name}</div>
                      <p className="text-gray-700 leading-relaxed">{actor.character}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Reviews:</h3>
        <div className="flex flex-wrap -m-2">
          {reviews.map((review, index) => (
            <div key={index} className="w-full sm:w-1/2 p-2">
              <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-start">
                <img
                  src={
                    review.author_details.avatar_path && review.author_details.avatar_path.startsWith('/https')
                      ? review.author_details.avatar_path.replace(/^\//, '')
                      : review.author_details.avatar_path
                        ? `https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`
                        : DefaultAvatar
                  }
                  alt={review.author}
                  className="w-16 h-16 rounded-full mr-4 shadow"
                />
                <div>
                  <div className="font-bold text-lg mb-2 text-gray-900 border-b">{review.author}</div>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedReviews[index] ? 'max-h-full' : 'max-h-20'}`}>
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>
                  {review.content.length > 220 && (
                    <button onClick={() => handleExpandClick(index)} className="mt-2 text-blue-500 hover:text-blue-600">
                      {expandedReviews[index] ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
};

export default MovieDetails;