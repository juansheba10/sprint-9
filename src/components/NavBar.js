import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/script'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signIn');
    } catch (error) {
      console.log('Error al hacer logout:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6 text-white">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">Movie App</span>
      </div>
      <div className="block lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-3 py-2 border rounded text-gray-300 border-gray-600 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} w-full block flex-grow lg:flex lg:items-center lg:w-auto`}>
        <div className="text-sm lg:flex-grow lg:flex lg:justify-end">
          <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
            Movies
          </Link>
          <Link to="/Series" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
            TV Shows
          </Link>
          {currentUser ? (
            <>
              <Link to="/Profile" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                Profile
              </Link>
              <button onClick={handleLogout} className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                Logout
              </button>
            </>
          ) : (
            <Link to="/signUp" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
              Sign Up
            </Link>
          )}
          
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
