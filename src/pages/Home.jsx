import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Bienvenido a La Cuponera</h1>
      <p className="text-gray-700 mt-4">
        ¡Consigue los mejores descuentos en tus tiendas favoritas!
      </p>
      <div className="mt-6 flex space-x-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Regístrate ahora
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default Home;
