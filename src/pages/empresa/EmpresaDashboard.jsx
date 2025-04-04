import React from "react";
import { useNavigate } from "react-router-dom";

function EmpresaDashboard() {
  const navigate = useNavigate();

  const goTo = (path) => () => navigate(path);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Panel Empresa Ofertante</h1>
        <button
          onClick={() => {
            // Aquí podrías agregar signOut si deseas
            navigate("/empresa/login");
          }}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Bienvenido/a al panel de gestión de tu empresa.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={goTo("/empresa/ofertas")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-green-200 hover:border-green-400"
          >
            <h3 className="text-lg font-semibold text-green-700 mb-2">Gestión de Ofertas</h3>
            <p className="text-gray-600 text-sm">
              Registra y administra tus promociones, visualiza el estado y desempeño de tus ofertas.
            </p>
          </div>

          <div
            onClick={goTo("/empresa/empleados")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-green-200 hover:border-green-400"
          >
            <h3 className="text-lg font-semibold text-green-700 mb-2">Gestión de Empleados</h3>
            <p className="text-gray-600 text-sm">
              Agrega y administra los empleados encargados de redimir cupones.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmpresaDashboard;

