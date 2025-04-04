import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/admin/login");
    }).catch((err) => {
      console.error("Error al cerrar sesión:", err);
      alert("Ocurrió un error al cerrar sesión.");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Administrador - La Cuponera</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Panel de Administración</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/empresas"
            className="bg-white border border-gray-300 hover:border-blue-500 rounded-lg shadow-md p-6 text-center transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">Gestión de Empresas</h3>
            <p className="text-sm text-gray-500 mt-2">Ver, registrar o eliminar empresas ofertantes.</p>
          </Link>

          <Link
            to="/admin/promociones"
            className="bg-white border border-gray-300 hover:border-blue-500 rounded-lg shadow-md p-6 text-center transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">Gestión de Promociones</h3>
            <p className="text-sm text-gray-500 mt-2">Aprobar, rechazar o descartar promociones.</p>
          </Link>

          <Link
            to="/admin/rubros"
            className="bg-white border border-gray-300 hover:border-blue-500 rounded-lg shadow-md p-6 text-center transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">Gestión de Rubros</h3>
            <p className="text-sm text-gray-500 mt-2">Crear o eliminar rubros disponibles.</p>
          </Link>

          <Link
            to="/admin/clientes"
            className="bg-white border border-gray-300 hover:border-blue-500 rounded-lg shadow-md p-6 text-center transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">Gestión de Clientes</h3>
            <p className="text-sm text-gray-500 mt-2">Consultar datos de clientes y sus cupones.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
