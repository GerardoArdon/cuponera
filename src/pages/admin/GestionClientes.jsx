import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesRef = collection(db, "users");
        const querySnapshot = await getDocs(clientesRef);
        const listaClientes = [];
        querySnapshot.forEach((doc) => {
          listaClientes.push({ id: doc.id, ...doc.data() });
        });
        setClientes(listaClientes);
      } catch (err) {
        console.error("Error al cargar clientes:", err);
        setError("Error al cargar clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <div className="p-4">Cargando clientes...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Teléfono</th>
                <th className="px-4 py-2 text-left">DUI</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-t">
                  <td className="px-4 py-2">
                    {cliente.firstName} {cliente.lastName}
                  </td>
                  <td className="px-4 py-2">{cliente.email}</td>
                  <td className="px-4 py-2">{cliente.phone}</td>
                  <td className="px-4 py-2">{cliente.dui}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => alert("Funcionalidad de ver cupones pendiente")}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Ver Cupones
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GestionClientes;
