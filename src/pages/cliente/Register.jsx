import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dui: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);



    //validaciones básicas (por ejemplo, contraseña de al menos 6 caracteres)
    if (!form.email || !form.password) {
      setError("El correo y la contraseña son obligatorios");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }



    try {
      const { email, password, firstName, lastName, phone, address, dui } = form;
      
      //Crear el usuario en Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      //actualizar el perfil, por ejemplo, el displayName
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      
      //en firestore crea un documento en la colección "users" usando el UID del usuario
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email,
        phone,
        address,
        dui,
      });
      
      //Despues de registrar, redirige al usuario de regreso a la página de inicio
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Registro de Cliente</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Nombres"
            className="w-full p-2 border rounded mt-2"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellidos"
            className="w-full p-2 border rounded mt-2"
            value={form.lastName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            className="w-full p-2 border rounded mt-2"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            className="w-full p-2 border rounded mt-2"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            className="w-full p-2 border rounded mt-2"
            value={form.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="dui"
            placeholder="Número de DUI"
            className="w-full p-2 border rounded mt-2"
            value={form.dui}
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
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}


export default Register;
