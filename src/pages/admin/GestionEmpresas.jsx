import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom"; 

function GestionEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    direccion: "",
    contacto: "",
    telefono: "",
    correo: "",
    rubro: "",
    porcentajeComision: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "empresas"));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setEmpresas(data);
      } catch (err) {
        setError("Error al cargar empresas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEmpresa = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "empresas"), form);
      alert("Empresa registrada correctamente.");
      window.location.reload();
    } catch (err) {
      console.error("Error al registrar empresa:", err);
      alert("Hubo un error al registrar la empresa.");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Estás seguro que deseas eliminar esta empresa?");
    if (confirm) {
      await deleteDoc(doc(db, "empresas", id));
      setEmpresas(empresas.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ✅ Botón de regreso al Dashboard */}
      <div className="mb-4">
        <Link
          to="/admin/dashboard"
          className="inline-block bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          ⬅︎ Volver al Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Gestión de Empresas Ofertantes</h1>

      {/* Formulario de registro */}
      <form
        onSubmit={handleAddEmpresa}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-4 rounded shadow"
      >
        <input name="nombre" value={form.nombre} onChange={handleChange} className="border p-2 rounded" placeholder="Nombre de la empresa" required />
        <input name="codigo" value={form.codigo} onChange={handleChange} className="border p-2 rounded" placeholder="Código (3 letras + 3 números)" required />
        <input name="direccion" value={form.direccion} onChange={handleChange} className="border p-2 rounded" placeholder="Dirección" required />
        <input name="contacto" value={form.contacto} onChange={handleChange} className="border p-2 rounded" placeholder="Nombre del contacto" required />
        <input name="telefono" value={form.telefono} onChange={handleChange} className="border p-2 rounded" placeholder="Teléfono" required />
        <input name="correo" value={form.correo} onChange={handleChange} className="border p-2 rounded" placeholder="Correo electrónico" required />
        <input name="rubro" value={form.rubro} onChange={handleChange} className="border p-2 rounded" placeholder="Rubro" required />
        <input name="porcentajeComision" value={form.porcentajeComision} onChange={handleChange} className="border p-2 rounded" placeholder="% Comisión" required />
        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Registrar Empresa
        </button>
      </form>

      {/* Tabla de empresas */}
      {loading ? (
        <p>Cargando empresas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Contacto</th>
                <th className="px-4 py-2 text-left">Rubro</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="border-t">
                  <td className="px-4 py-2">{empresa.nombre}</td>
                  <td className="px-4 py-2">{empresa.codigo}</td>
                  <td className="px-4 py-2">{empresa.contacto}</td>
                  <td className="px-4 py-2">{empresa.rubro}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEliminar(empresa.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {empresas.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No hay empresas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GestionEmpresas;

