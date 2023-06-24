import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../Firebase/script';
import { collection, where, getDocs, query } from 'firebase/firestore';
import DefaultAvatar from '../components/Assets/3551739.jpg';

const Watchedlist = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [watchedlistMovies, setWatchedlistMovies] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const carouselRef = useRef(null);
  const moviesToShow = 3; // Cambia este valor según cuántas películas quieres mostrar a la vez en el carrusel.

  useEffect(() => {
    const fetchWatchedlistMovies = async () => {
      const userId = user.uid;
      const watchedlistQuery = query(collection(db, 'watchedlist'), where('userId', '==', userId));
      const watchedlistDocs = await getDocs(watchedlistQuery);

      let movies = [];
      watchedlistDocs.forEach((doc) => {
        movies.push(doc.data());
      });
      setWatchedlistMovies(movies);
    };

    fetchWatchedlistMovies();
  }, [user]);

  useEffect(() => {
    setVisibleMovies(watchedlistMovies.slice(carouselIndex, carouselIndex + moviesToShow));
  }, [carouselIndex, watchedlistMovies]);

  const nextMovies = () => {
    setCarouselIndex((prevIndex) => Math.min(prevIndex + 1, watchedlistMovies.length - moviesToShow));
  };

  const prevMovies = () => {
    setCarouselIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevMovies}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            carouselIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={carouselIndex === 0}
        >
          Prev
        </button>
        <div className="flex space-x-4">
          {visibleMovies.map((movie, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="relative">
                <img
                  src={movie.moviePoster ? `https://image.tmdb.org/t/p/w500${movie.moviePoster}` : DefaultAvatar}
                  alt={movie.movieTitle}
                  className="lg:w-32 xl:w-48 rounded-3xl mr-4 shadow"
                />
                <div className="absolute bottom-0 left-0 p-1 bg-green-500 text-white font-bold text-xs rounded-tr">
                  Visto
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={nextMovies}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 ${
            carouselIndex === watchedlistMovies.length - moviesToShow ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={carouselIndex === watchedlistMovies.length - moviesToShow}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Watchedlist;
