import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-green-200">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 text-center max-w-2xl mx-4">
        <h1 className="text-5xl font-bold text-blue-700">
          Bienvenido a La Cuponera
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          ¡Consigue los mejores descuentos en tus tiendas favoritas y ahorra en grande!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Regístrate ahora
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}


export default Home;

