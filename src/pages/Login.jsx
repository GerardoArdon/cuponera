//Pagina para iniciar sesion

import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    

    // si el inicio de sesion es correcto, lleva a la pagina de las ofertas, sino muestra error
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/offers");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      //si el error es por credenciales incorrectas, mostramos el mensaje personalizado
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        setError("El correo o la contraseña son incorrectos");
      } else {
        setError(error.message);
      }
    }
  };


  //parte de iniciar sesion
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Inicio de Sesión</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            className="w-full p-2 border rounded mt-2"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full p-2 border rounded mt-2"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 mt-4 rounded hover:bg-green-600"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
