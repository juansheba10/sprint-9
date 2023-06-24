import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../Firebase/script';
import { collection, where, getDocs, query } from 'firebase/firestore';
import DefaultAvatar from '../components/Assets/3551739.jpg';

const Wishlist = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const moviesToShow = 3; // Cambia este valor según cuántas películas quieres mostrar a la vez en el carrusel.

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      const userId = user.uid;
      const wishlistQuery = query(collection(db, 'wishlist'), where('userId', '==', userId));
      const wishlistDocs = await getDocs(wishlistQuery);

      let movies = [];
      wishlistDocs.forEach((doc) => {
        movies.push(doc.data());
      });
      setWishlistMovies(movies);
    };

    fetchWishlistMovies();
  }, [user]);

  useEffect(() => {
    setVisibleMovies(wishlistMovies.slice(carouselIndex, carouselIndex + moviesToShow));
  }, [carouselIndex, wishlistMovies]);

  const nextMovies = () => {
    setCarouselIndex((prevIndex) => Math.min(prevIndex + 1, wishlistMovies.length - moviesToShow));
  };

  const prevMovies = () => {
    setCarouselIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
      <div className="flex justify-center items-center mt-4">
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
              </div>
              <div>
                <div className="font-bold lg:text-xl xl:text-2xl mb-2 text-gray-900 border-b">
                  {movie.movieTitle}
                </div>
                <p className="text-gray-700 leading-relaxed">{movie.movieDescription}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={nextMovies}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 ${
            carouselIndex === wishlistMovies.length - moviesToShow ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={carouselIndex === wishlistMovies.length - moviesToShow}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
