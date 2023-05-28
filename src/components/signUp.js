import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/script.js';  // Asegúrate de importar la instancia correcta de auth
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useHistory
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();


  const signUpWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)  // Usa la instancia de auth que has importado
      .then((userCredential) => {
          const user = userCredential.user;
          navigate('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage + errorCode);
      });
  };
  const signInWithGoogleHandler = (event) => {
    event.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage + errorCode);
      });
  };
  

  return (
   <section className="relative py-20 lg:py-10 overflow-hidden">
  <div className="container px-4 mx-auto">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap -mx-4 xl:items-center">
        <div className="w-full lg:w-1/2 xl:w-3/5 px-4 order-last lg:order-first">
          <div className="relative max-w-xl mx-auto lg:mx-0 lg:max-w-3xl h-full">
            <img className="block w-full h-166 lg:h-full object-cover rounded-3xl" src="https://fr.web.img3.acsta.net/pictures/22/10/04/08/52/2484953.jpg" alt="sss" />
            <div className="absolute bottom-0 w-full left-0 p-4 sm:p-6">
              <div className="p-6 sm:p-10 backdrop-blur-md backdrop-filter bg-black bg-opacity-30 rounded-5xl">
                <h5 className="text-3xl text-white font-semibold mb-2">Selina Destin</h5>
                <span className="block text-sm text-white font-semibold mb-6">Web Development Agency</span>
                <p className="max-w-xl text-2xl text-white font-semibold mb-15">&quot;Untitled has become essential in starting every new project, we can&apos;t imagine working without it.&quot;</p>
                <div>
                  <button className="inline-block mr-2 h-1 w-5 rounded-full bg-white hover:bg-blue-100"></button>
                  <button className="inline-block mr-2 h-1 w-5 rounded-full bg-white hover:bg-blue-100"></button>
                  <button className="inline-block h-1 w-5 rounded-full bg-blue-900"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 xl:w-2/5 px-4 mb-16 lg:mb-0">
          <div className="max-w-md lg:py-20 mx-auto lg:mr-0">
            <h3 className="font-heading text-4xl text-gray-900 font-semibold mb-4">Sign up to your account</h3>
            <p className="text-lg text-gray-500 mb-10">Greetings on your return! We kindly request you to enter your details.</p>
            <div className="flex flex-wrap mb-6 items-center -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
                <button className="inline-flex w-full py-3 px-4 items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 transition duration-100" href="#">
                  <img src="saturn-assets/images/sign-up/icon-facebook.svg" alt="" />
                  <span className="ml-4 text-sm font-semibold text-gray-500">Login with Facebook</span>
                </button>
              </div>
              <div className="w-full md:w-1/2 px-2">
  <button className="inline-flex w-full py-3 px-4 items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 transition duration-100" onClick={signInWithGoogleHandler}>
    <img src="saturn-assets/images/sign-up/icon-google.svg" alt="" />
    <span className="ml-4 text-sm font-semibold text-gray-500">Login with Google</span>
  </button>
</div>

            </div>
            <div className="flex mb-6 items-center">
              <div className="w-full h-px bg-gray-300"></div>
              <span className="mx-4 text-sm font-semibold text-gray-500">Or</span>
              <div className="w-full h-px bg-gray-300"></div>
            </div>
            <form action="">
              <div className="mb-6">
                <label className="block mb-1.5 text-sm text-gray-900 font-semibold" htmlFor="">Email</label>
                <input className="w-full py-3 px-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-purple-500 focus:outline-purple rounded-lg" type="email" name="userEmail" onChange={event => setEmail(event.target.value)} placeholder="pat@saturn.dev" />
              </div>
              <div className="mb-7">
                <div className="flex mb-1.5 items-center justify-between">
                  <label className="block text-sm text-gray-900 font-semibold" htmlFor="">Password</label>
                  <button className="inline-block text-xs font-semibold text-orange-900 hover:text-gray-900" href="#">Forget password?</button>
                </div>
                <div className="relative">
                  <input className="w-full py-3 px-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-purple-500 focus:outline-purple rounded-lg" type="password" name="userPassword" onChange={event => setPassword(event.target.value)}  placeholder="Enter your password" />
                  <button className="absolute top-1/2 right-0 mr-3 transform -translate-y-1/2 inline-block hover:scale-110 transition duration-100">
                    <img src="saturn-assets/images/sign-up/icon-eye.svg" alt="" />
                  </button>
                </div>
              </div>
              <div className="flex mb-6 items-center">
                <input type="checkbox" value="" id="" />
                <label className="ml-2 text-xs text-gray-800" htmlFor="">Remember for 30 days</label>
              </div>
              <button className="relative group block w-full mb-6 py-3 px-5 text-center text-sm font-semibold text-orange-50 bg-orange-900 rounded-full overflow-hidden"  onClick={(event) => signUpWithEmailAndPasswordHandler(event, email, password)} >
                <div className="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
                <span className="relative">Sign Up</span>
              </button>
                  <span className="text-xs font-semibold text-gray-900">
                    <span>Do you have an account</span>
                    <Link to="/signIn" className="ml-1 inline-block text-orange-900 hover:text-orange-700">
                      Sign In
                    </Link>
                  </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
};

export default SignUp;
