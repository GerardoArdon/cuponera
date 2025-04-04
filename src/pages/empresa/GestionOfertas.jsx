import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

function GestionOfertas() {
  const [ofertas, setOfertas] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    precioRegular: "",
    precioOferta: "",
    fechaInicio: "",
    fechaFin: "",
    fechaLimite: "",
    descripcion: "",
    rubro: "",
    codigoEmpresa: "EMP001",
    estado: "En espera de aprobación",
  });

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "promotions"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setOfertas(lista);

      // Obtener rubros desde Firebase
      const rubrosSnapshot = await getDocs(collection(db, "rubros"));
      const rubroList = rubrosSnapshot.docs.map((doc) => doc.data().nombre);
      setRubros(rubroList);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "promotions"), form);
      alert("Oferta registrada y enviada para aprobación.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al registrar oferta.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-4">
        <Link
          to="/empresa/dashboard"
          className="inline-block bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Gestión de Ofertas</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="border p-2 rounded"
          required
        />
        <input
          name="precioRegular"
          value={form.precioRegular}
          onChange={handleChange}
          placeholder="Precio Regular"
          className="border p-2 rounded"
          required
        />
        <input
          name="precioOferta"
          value={form.precioOferta}
          onChange={handleChange}
          placeholder="Precio Oferta"
          className="border p-2 rounded"
          required
        />
        <input
          name="fechaInicio"
          value={form.fechaInicio}
          onChange={handleChange}
          type="date"
          className="border p-2 rounded"
          required
        />
        <input
          name="fechaFin"
          value={form.fechaFin}
          onChange={handleChange}
          type="date"
          className="border p-2 rounded"
          required
        />
        <input
          name="fechaLimite"
          value={form.fechaLimite}
          onChange={handleChange}
          type="date"
          className="border p-2 rounded"
          required
        />

        {/* Selector de Rubro */}
        <select
          name="rubro"
          value={form.rubro}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Selecciona un rubro</option>
          {rubros.map((rubro, index) => (
            <option key={index} value={rubro}>
              {rubro}
            </option>
          ))}
        </select>

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="border p-2 rounded col-span-full"
          required
        />
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Registrar Oferta
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Mis Ofertas</h2>
        {ofertas.length === 0 ? (
          <p>No hay ofertas registradas.</p>
        ) : (
          <ul className="space-y-4">
            {ofertas
              .filter((oferta) => oferta.codigoEmpresa === form.codigoEmpresa)
              .map((oferta) => (
                <li key={oferta.id} className="border p-4 rounded">
                  <h3 className="text-xl font-bold">{oferta.titulo}</h3>
                  <p><strong>Rubro:</strong> {oferta.rubro}</p>
                  <p><strong>Estado:</strong> {oferta.estado}</p>
                  <p><strong>Precio Oferta:</strong> ${oferta.precioOferta}</p>
                  <p><strong>Precio Regular:</strong> ${oferta.precioRegular}</p>
                  <p><strong>Fecha Inicio:</strong> {oferta.fechaInicio}</p>
                  <p><strong>Fecha Fin:</strong> {oferta.fechaFin}</p>
                  <p><strong>Fecha Límite:</strong> {oferta.fechaLimite}</p>
                  <p><strong>Descripción:</strong> {oferta.descripcion}</p>
                  {oferta.razonRechazo && (
                    <p className="text-red-600"><strong>Motivo Rechazo:</strong> {oferta.razonRechazo}</p>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GestionOfertas;

