import { Link } from "react-router-dom";

function EmpresaDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Panel de Empresa Ofertante
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/empresa/ofertas"
          className="bg-green-500 text-white py-4 px-6 rounded shadow hover:bg-green-600 transition text-center"
        >
          Gestión de Ofertas
        </Link>

        <Link
          to="/empresa/empleados"
          className="bg-purple-500 text-white py-4 px-6 rounded shadow hover:bg-purple-600 transition text-center"
        >
          Gestión de Empleados
        </Link>
      </div>
    </div>
  );
}

export default EmpresaDashboard;
