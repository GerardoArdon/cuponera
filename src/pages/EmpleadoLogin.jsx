// src/pages/EmpleadoLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

function EmpleadoLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const empleadosRef = collection(db, "empleados");
      const q = query(
        empleadosRef,
        where("correo", "==", form.correo),
        where("password", "==", form.password)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Login exitoso
        localStorage.setItem("empleadoCorreo", form.correo); // Puedes usarlo para mantener sesión
        navigate("/redeem");
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Login Empleado
        </h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="correo"
            placeholder="Correo del empleado"
            className="w-full p-2 border rounded mt-2"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full p-2 border rounded mt-2"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmpleadoLogin;
