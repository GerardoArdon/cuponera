import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmpresaLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const EMPRESA_EMAIL = "empresa@cuponera.com";
  const EMPRESA_PASSWORD = "empresa123";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (form.email === EMPRESA_EMAIL && form.password === EMPRESA_PASSWORD) {
      navigate("/empresa/dashboard");
    } else {
      setError("El correo o la contraseña son incorrectos.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login Empresa Ofertante</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            className="w-full p-2 border rounded mt-2"
            value={form.email}
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

export default EmpresaLogin;
