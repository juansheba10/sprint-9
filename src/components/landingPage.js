import React from 'react'

function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-4xl md:text-6xl text-center font-bold mb-4">¡Descubre y disfruta tus películas y series favoritas!</h1>
            <p className="text-lg md:text-xl mb-8 text-center px-4">Explora y recibe recomendaciones personalizadas de películas y series según tus gustos y preferencias. Regístrate o inicia sesión para comenzar a disfrutar.</p>
            <div className="mb-8">
                <img src="./Assets//maxresdefault-5-1024x576.jpg" alt="Películas y series" className="rounded-md shadow-lg" />
            </div>
            <div>
                <a href="/registro" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Regístrate</a>
                <a href="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Iniciar sesión</a>
            </div>
        </div>
    );
}

export default LandingPage;
