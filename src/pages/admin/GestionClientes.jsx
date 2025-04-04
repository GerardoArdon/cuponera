import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedClient, setSelectedClient] = useState(null);
  const [clientCoupons, setClientCoupons] = useState([]);
  const [showCouponsModal, setShowCouponsModal] = useState(false);

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

  const handleVerCupones = async (cliente) => {
    try {
      const q = query(collection(db, "coupons"), where("userId", "==", cliente.id));
      const snapshot = await getDocs(q);
      const listaCupones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientCoupons(listaCupones);
      setSelectedClient(cliente);
      setShowCouponsModal(true);
    } catch (err) {
      console.error("Error al obtener cupones:", err);
    }
  };

  const closeModal = () => {
    setShowCouponsModal(false);
    setSelectedClient(null);
    setClientCoupons([]);
  };

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
                  <td className="px-4 py-2">{cliente.firstName} {cliente.lastName}</td>
                  <td className="px-4 py-2">{cliente.email}</td>
                  <td className="px-4 py-2">{cliente.phone}</td>
                  <td className="px-4 py-2">{cliente.dui}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleVerCupones(cliente)}
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

      {/* Modal de cupones */}
      {showCouponsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Cupones de {selectedClient.firstName}</h2>
            {["disponible", "canjeado", "vencido"].map(status => (
              <div key={status} className="mb-4">
                <h3 className="font-semibold capitalize mb-1">Cupones {status}</h3>
                {clientCoupons.filter(c => c.status === status).length === 0 ? (
                  <p className="text-sm text-gray-500">Ninguno</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {clientCoupons
                      .filter(c => c.status === status)
                      .map(coupon => (
                        <li key={coupon.id} className="border p-2 rounded bg-gray-50">
                          <strong>{coupon.promotionTitle}</strong> — Código: {coupon.couponCode}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="text-right">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionClientes;
