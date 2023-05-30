import React, { useEffect,useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '../Firebase/script';
import { updateProfile } from 'firebase/auth'; 
import { doc, setDoc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { Puff } from 'react-loader-spinner';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';


function CreateProfile() {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favoriteMovie, setFavoriteMovie] = useState(null);
  const [profileCreated, setProfileCreated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSearch, setNewSearch] = useState('');
  const [newSearchResults, setNewSearchResults] = useState([]);
  const [newFavoriteMovie, setNewFavoriteMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await searchMovies(search);
  }

  const handleNewAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  }
  
  const handleNewSearchChange = (e) => {
    setNewSearch(e.target.value);
  }
  
  const handleNewSearchSubmit = async (e) => {
    e.preventDefault();
    await searchMovies(newSearch, setNewSearchResults);
  }
  
  const handleNewFavoriteMovieSelect = (movie) => {
    setNewFavoriteMovie(movie);
  }
  

  const searchMovies = async (query, setSearchResultsFunc) => {
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=7be72508776961f3948639fbd796bccd&query=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      setSearchResultsFunc(response.data.results);
    } catch (error) {
      console.error('Error al buscar películas:', error);
    }
  }
  

  const handleFavoriteMovieSelect = (movie) => {
    setFavoriteMovie(movie);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Actualizar nombre de usuario en Firebase Auth
    await updateProfile(auth.currentUser, { displayName: username });

    // Subir avatar a Firebase Storage
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, avatar);

    if (!username || !avatarUrl || !favoriteMovie) {
      alert('Por favor, completa todos los campos antes de enviar.');
      return;
    }

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Puedes usar este código para mostrar el progreso de la subida.
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        // Manejar errores aquí
        console.log(error);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        setAvatarUrl(downloadURL);
        
        // Guardar la URL de descarga y la película favorita en Firestore
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDocRef, { avatar: downloadURL, favoriteMovie: favoriteMovie }, { merge: true });
        setProfileCreated(true);
      }
    );
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(user.displayName);
          setAvatarUrl(userData.avatar);
          setFavoriteMovie(userData.favoriteMovie);
          setProfileCreated(true);
        }
      }
      setLoading(false); // Agregar esta línea
    });

    // Limpia la suscripción cuando el componente se desmonta
    return unsubscribe;
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();


    if (!username || !avatarUrl || !favoriteMovie) {
      alert('Por favor, completa todos los campos antes de enviar.');
      return;
    }
    // Actualizar nombre de usuario en Firebase Auth
    await updateProfile(auth.currentUser, { displayName: username });
  
    // Si el usuario ha seleccionado un nuevo avatar, súbelo a Firebase Storage
    let downloadURL = avatarUrl;
    if (avatar) {
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, avatar);
  
      downloadURL = await new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            console.log(error);
            reject(error);
          }, 
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          }
        );
      });
  
      setAvatarUrl(downloadURL);
    }
  
    // Guardar la URL de descarga y la nueva película favorita en Firestore
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDocRef, { avatar: downloadURL, favoriteMovie: newFavoriteMovie }, { merge: true });
    setIsEditing(false);
  }
  
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Puff color="#00BFFF" height={100} width={100} />
    </div>
  ) : isEditing ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="mb-2 text-center text-3xl font-extrabold text-gray-900">Editar perfil</h2>
          <form className="space-y-6" onSubmit={handleEditSubmit}>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Cambiar avatar:
              </label>
              <input id="avatar" name="avatar" type="file" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={handleNewAvatarChange} />
            </div>
            <div>
              <label htmlFor="favorite-movie" className="block text-sm font-medium text-gray-700">
                Cambiar película favorita:
              </label>
              <input id="favorite-movie" name="favorite-movie" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={newSearch} onChange={handleNewSearchChange} />
              <button type="button" onClick={handleNewSearchSubmit}>Buscar</button>
              {newSearchResults.map((movie, index) => (
                <div 
                  key={index} 
                  onClick={() => handleNewFavoriteMovieSelect(movie)}
                  className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-out ${newFavoriteMovie && newFavoriteMovie.id === movie.id ? 'bg-gray-300' : 'bg-white'}`}
                >
                  <img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt={`${movie.title} poster`} className="w-24" />
                  <div>
                    <p className="font-bold text-lg">{movie.title}</p>
                    <p className="text-gray-500">{movie.release_date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) :  profileCreated ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="mb-2 text-center text-3xl font-extrabold text-gray-900">Tu perfil</h2>
          <p>Nombre de usuario: {username}</p>
          <p>Avatar: <img src={avatarUrl} alt="Avatar" /></p>
          
          {favoriteMovie && (
  <>
    <p>Película favorita: {favoriteMovie.title} ({favoriteMovie.release_date})</p>
    <img src={`https://image.tmdb.org/t/p/w200/${favoriteMovie.poster_path}`} alt={`${favoriteMovie.title} poster`} className="w-24 mx-auto" />
  </>
)}
<button onClick={() => setIsEditing(true)}>Editar perfil</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="mb-2 text-center text-3xl font-extrabold text-gray-900">Crear perfil</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de usuario
              </label>
              <input id="username" name="username" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={username} onChange={handleUsernameChange} />
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <input id="avatar" name="avatar" type="file" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={handleAvatarChange} />
            </div>
            <div>
              <label htmlFor="favorite-movie" className="block text-sm font-medium text-gray-700">
                Película favorita
              </label>
              <input id="favorite-movie" name="favorite-movie" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={search} onChange={handleSearchChange} />
              <button type="button" onClick={handleSearchSubmit}>Buscar</button>
              {searchResults.map((movie, index) => (
  <div 
    key={index} 
    onClick={() => handleFavoriteMovieSelect(movie)}
    className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-out ${favoriteMovie && favoriteMovie.id === movie.id ? 'bg-gray-300' : 'bg-white'}`}
  >
    <img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt={`${movie.title} poster`} className="w-24" />
    <div>
      <p className="font-bold text-lg">{movie.title}</p>
      <p className="text-gray-500">{movie.release_date}</p>
    </div>
  </div>
))}
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Crear perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;
