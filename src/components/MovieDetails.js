import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import DefaultAvatar from "../components/Assets/3551739.jpg"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { db } from '../Firebase/script';
import { deleteDoc, doc, query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { Puff } from 'react-loader-spinner';


const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({})
  const [cast, setCast] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInWatchedlist, setIsInWatchedlist] = useState(false)
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);



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

  const checkWishlist = async () => {
    const userId = user.uid;
    const wishlistQuery = query(collection(db, 'wishlist'), where('userId', '==', userId), where('movieId', '==', id));
    const wishlistDocs = await getDocs(wishlistQuery);

    if (wishlistDocs.empty) {
      setIsInWishlist(false);
    } else {
      setIsInWishlist(true);
    }
    setLoading(false);
  }

  // Comprobación inicial para la lista de películas vistas
  const checkWatchedlist = async () => {
    const userId = user.uid;
    const watchedlistQuery = query(collection(db, 'watchedlist'), where('userId', '==', userId), where('movieId', '==', id));
    const watchedlistDocs = await getDocs(watchedlistQuery);

    if (watchedlistDocs.empty) {
      setIsInWatchedlist(false);
    } else {
      setIsInWatchedlist(true);
    }
    setLoading(false);
  }

  const actorsToShow = 3;  // Cambia este valor según cuántos actores quieres mostrar a la vez.

  const nextActors = () => {
    setCarouselIndex((prevIndex) => Math.min(prevIndex + actorsToShow, cast.length - actorsToShow));
  };

  const prevActors = () => {
    setCarouselIndex((prevIndex) => Math.max(prevIndex - actorsToShow, 0));
  };




  const handleExpandClick = (index) => {
    setExpandedReviews({
      ...expandedReviews,
      [index]: !expandedReviews[index],
    });
  };

  useEffect(() => {
    checkWishlist();
    checkWatchedlist();
  }, [id, user]);
 
  const addToWishlist = async () => {
    const userId = user.uid;
  
    if (isInWishlist) {
      const wishlistQuery = query(collection(db, 'wishlist'), where('userId', '==', userId), where('movieId', '==', id));
      const wishlistDocs = await getDocs(wishlistQuery);
      const docRef = doc(db, 'wishlist', wishlistDocs.docs[0].id);
      await deleteDoc(docRef);
      setIsInWishlist(false);
    } else {
      try {
        const docRef = await addDoc(collection(db, 'wishlist'), {
          userId: userId,
          movieId: id,
          movieTitle: movie.title,
          moviePoster: movie.poster_path,
        });
        console.log("Document written with ID: ", docRef.id);
        setIsInWishlist(true);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };
  
  const watchedWishlist = async () => {
    const userId = user.uid;
  
    if (isInWatchedlist) {
      const watchedlistQuery = query(collection(db, 'watchedlist'), where('userId', '==', userId), where('movieId', '==', id));
      const watchedlistDocs = await getDocs(watchedlistQuery);
      const docRef = doc(db, 'watchedlist', watchedlistDocs.docs[0].id);
      await deleteDoc(docRef);
      setIsInWatchedlist(false);
    } else {
      try {
        const docRef = await addDoc(collection(db, 'watchedlist'), {
          userId: userId,
          movieId: id,
          movieTitle: movie.title,
          moviePoster: movie.poster_path,
        });
        console.log("Document written with ID: ", docRef.id);
        setIsInWatchedlist(true);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  

  if (!movie) {
    if (!movie) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Puff color="#00BFFF" height={100} width={100} />
        </div>
      )
    }
    
  }

  return (
    <div className="max-w-full mx-auto p-4 sm:p-8">
  <Link to="/" className="inline-block mb-4 text-blue-500">Back to movies</Link>
  <div className="flex flex-col sm:flex-row mb-4">
    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 sm:mr-4" />
    <div>
      <h2 className="text-2xl font-semibold mb-2">{movie.title}</h2>
      <p className="text-sm text-gray-500 mb-2">{movie.release_date.split('-')[0]} • {movie.runtime} min</p>
      <p className="text-gray-600">{movie.overview}</p>
      <div className="my-4">
        <p className="text-lg font-bold">Rating:</p>
        <div className="flex items-center justify-start">
          <div style={{ width: "100px", height: "100px", marginRight: "10px" }}>
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
          <div>
            <p className="text-lg font-semibold">{movie.vote_average}</p>
            <p className="text-sm text-gray-500">({movie.vote_count} votes)</p>
          </div>
        </div>
      </div>
      {loading ? (
        <Puff color="#00BFFF" height={100} width={100} />
      ) : (
        <div className="sm:flex sm:gap-4">
          <button 
            className={`w-full sm:w-auto font-bold py-2 px-4 rounded ${isInWishlist ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700"} text-white mb-2 sm:mb-0`}
            onClick={addToWishlist}
          >
            {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          </button>
          <button 
            className={`w-full sm:w-auto font-bold py-2 px-4 rounded ${isInWatchedlist ? "bg-green-700" : "bg-green-500 hover:bg-green-700"} text-white`}
            onClick={watchedWishlist}
          >
            {isInWatchedlist ? "Remove from watchedlist" : "Add to watchedlist"}
          </button>
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold mb-2">Cast:</h3>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <button 
            onClick={prevActors} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0"
            disabled={carouselIndex === 0}
          >
            Anterior
          </button>
          <div className="flex space-x-4">
            {cast.length > 0 && cast.slice(carouselIndex, carouselIndex + actorsToShow).map(actor => (
              <div key={actor.cast_id} className="flex flex-col items-center">
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
            ))}
          </div>
          <button 
            onClick={nextActors} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0"
            disabled={carouselIndex === cast.length - actorsToShow}
          >
            Siguiente
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Reviews:</h3>
        <div className="flex flex-wrap -m-2">
         {reviews.map((review, index) => (
    <div key={index} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
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
            <div className="flex-grow overflow-auto">
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
  </div>
</div>

  );  
};

export default MovieDetails;