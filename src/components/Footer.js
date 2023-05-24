const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-6 mt-8">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Nombre de la Compañía</h3>
                    <p className="mt-1">Todos los derechos reservados, 2023</p>
                </div>

                <div>
                    <a href="/terms" className="text-gray-300 hover:text-white mr-4">Términos de Uso</a>
                    <a href="/privacy" className="text-gray-300 hover:text-white mr-4">Política de Privacidad</a>
                    <a href="/contact" className="text-gray-300 hover:text-white">Contacto</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
