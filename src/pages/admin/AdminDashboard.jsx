// src/pages/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Administrador - La Cuponera</h1>
        <div>
          <button
            onClick={() => {
              // Aquí deberías implementar la lógica para cerrar sesión
              // Por ejemplo, auth.signOut() y redirigir al login
              alert("Cerrar sesión (pendiente de implementación)");
            }}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar de navegación */}
        <nav className="w-64 bg-white p-4 shadow">
          <ul className="space-y-2">
            <li>
              <Link to="/admin/empresas" className="text-blue-600 hover:underline">
                Gestión de Empresas
              </Link>
            </li>
            <li>
              <Link to="/admin/promociones" className="text-blue-600 hover:underline">
                Gestión de Promociones
              </Link>
            </li>
            <li>
              <Link to="/admin/rubros" className="text-blue-600 hover:underline">
                Gestión de Rubros
              </Link>
            </li>
            <li>
              <Link to="/admin/clientes" className="text-blue-600 hover:underline">
                Gestión de Clientes
              </Link>
            </li>
          </ul>
        </nav>

        {/* Área principal de contenido */}
        <main className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">Panel de Control</h2>
          <p>
            Bienvenido al panel de administración de <strong>La Cuponera</strong>.
          </p>
          <p className="mt-2">
            Desde aquí podrás gestionar empresas ofertantes, revisar y aprobar promociones, gestionar rubros y ver la información de los clientes.
          </p>
          {/* Aquí puedes agregar componentes adicionales, gráficos, tablas o estadísticas */}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

