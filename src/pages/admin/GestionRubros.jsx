import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom"; 

function GestionRubros() {
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRubro, setNewRubro] = useState("");

  const fetchRubros = async () => {
    setLoading(true);
    try {
      const rubrosRef = collection(db, "rubros");
      const querySnapshot = await getDocs(rubrosRef);
      const rubrosList = [];
      querySnapshot.forEach((docSnap) => {
        rubrosList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setRubros(rubrosList);
    } catch (err) {
      console.error("Error al cargar rubros:", err);
      setError("Error al cargar rubros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRubros();
  }, []);

  const handleAddRubro = async (e) => {
    e.preventDefault();
    if (newRubro.trim() === "") return;
    try {
      await addDoc(collection(db, "rubros"), { nombre: newRubro });
      alert("Rubro agregado exitosamente");
      setNewRubro("");
      fetchRubros();
    } catch (err) {
      console.error("Error al agregar rubro:", err);
      alert("Error al agregar rubro");
    }
  };

  const handleDeleteRubro = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este rubro?")) {
      try {
        await deleteDoc(doc(db, "rubros", id));
        setRubros(rubros.filter((r) => r.id !== id));
      } catch (err) {
        console.error("Error al eliminar rubro:", err);
        alert("Error al eliminar rubro");
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link
          to="/admin/dashboard"
          className="inline-block bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          ⬅︎ Volver al Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Gestión de Rubros</h1>

      <form onSubmit={handleAddRubro} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Nuevo rubro (ej: Restaurantes, Talleres, etc.)"
          value={newRubro}
          onChange={(e) => setNewRubro(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Agregar Rubro
        </button>
      </form>

      {loading ? (
        <p>Cargando rubros...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Rubro</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rubros.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No hay rubros registrados.
                  </td>
                </tr>
              ) : (
                rubros.map((rubro) => (
                  <tr key={rubro.id} className="border-t">
                    <td className="px-4 py-2">{rubro.nombre}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteRubro(rubro.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GestionRubros;
