// src/pages/empresa/GestionEmpleados.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

function GestionEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codigoEmpresa = "EMP001"; // Reemplazar por el código de la empresa logueada

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const ref = collection(db, "empleados");
        const querySnapshot = await getDocs(ref);
        const lista = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.codigoEmpresa === codigoEmpresa) {
            lista.push({ id: doc.id, ...data });
          }
        });
        setEmpleados(lista);
      } catch (err) {
        console.error("Error al cargar empleados:", err);
        setError("Error al cargar empleados");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEmpleado = async (e) => {
    e.preventDefault();
    const { nombres, apellidos, correo, password } = form;

    if (!nombres || !apellidos || !correo || !password) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "empleados"), {
        ...form,
        codigoEmpresa,
      });
      alert("Empleado registrado exitosamente.");
      window.location.reload();
    } catch (err) {
      console.error("Error al registrar empleado:", err);
      alert("Error al registrar empleado.");
    }
  };

  const handleDeleteEmpleado = async (id) => {
    if (confirm("¿Deseas eliminar este empleado?")) {
      await deleteDoc(doc(db, "empleados", id));
      setEmpleados(empleados.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestión de Empleados</h1>

      <form onSubmit={handleAddEmpleado} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
        <input name="nombres" value={form.nombres} onChange={handleChange} className="border p-2 rounded" placeholder="Nombres" required />
        <input name="apellidos" value={form.apellidos} onChange={handleChange} className="border p-2 rounded" placeholder="Apellidos" required />
        <input name="correo" type="email" value={form.correo} onChange={handleChange} className="border p-2 rounded" placeholder="Correo Electrónico" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} className="border p-2 rounded" placeholder="Contraseña" required />
        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Registrar Empleado
        </button>
      </form>

      {loading ? (
        <p>Cargando empleados...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Nombres</th>
                <th className="px-4 py-2 text-left">Apellidos</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">No hay empleados registrados.</td>
                </tr>
              ) : (
                empleados.map((emp) => (
                  <tr key={emp.id} className="border-t">
                    <td className="px-4 py-2">{emp.nombres}</td>
                    <td className="px-4 py-2">{emp.apellidos}</td>
                    <td className="px-4 py-2">{emp.correo}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => handleDeleteEmpleado(emp.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Eliminar</button>
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

export default GestionEmpleados;
