// src/pages/Offers.jsx
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para obtener las promociones de Firestore
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Referencia a la colección "promotions"
        const promotionsRef = collection(db, "promotions");
        // Consulta: obtener solo las promociones cuyo estado sea "Oferta aprobada"
        const q = query(promotionsRef, where("estado", "==", "Oferta aprobada"));
        const querySnapshot = await getDocs(q);

        const promotions = [];
        querySnapshot.forEach((doc) => {
          promotions.push({ id: doc.id, ...doc.data() });
        });

        setOffers(promotions);
      } catch (error) {
        console.error("Error al obtener las promociones:", error);
        setError("Error al obtener las promociones");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Función para manejar la compra y generación de cupón
  const handleBuy = async (offer) => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Verifica si el usuario está autenticado
    if (!user) {
      alert("Debes iniciar sesión para comprar cupones.");
      // Aquí podrías redirigir al usuario a la página de inicio de sesión
      return;
    }

    // Genera el código del cupón
    const codigoEmpresa = offer.codigoEmpresa || "DEF"; // Usa "DEF" si no se encuentra el código de la empresa
    const randomNumber = Math.floor(Math.random() * 9000000) + 1000000; // Número aleatorio de 7 dígitos
    const couponCode = `${codigoEmpresa}${randomNumber}`;

    try {
      // Guarda el cupón en la colección "coupons"
      await addDoc(collection(db, "coupons"), {
        couponCode: couponCode,
        offerId: offer.id,
        userId: user.uid,
        purchaseDate: new Date(),
        status: "disponible", // Estado del cupón, inicialmente disponible
        // Puedes agregar más campos si es necesario
      });
      alert(`Compra exitosa. Tu cupón es: ${couponCode}`);
    } catch (err) {
      console.error("Error generando el cupón: ", err);
      alert("Error al procesar la compra. Inténtalo de nuevo.");
    }
  };

  // Renderizado condicional según el estado de carga o error
  if (loading) {
    return <div className="container mx-auto p-4">Cargando ofertas...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  // Renderiza la lista de ofertas
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Ofertas Activas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{offer.titulo}</h2>
            <p className="text-gray-600">
              <strong>Categoría:</strong> {offer.rubro}
            </p>
            <p className="mt-2">
              <strong>Precio regular:</strong> ${offer.precioRegular}
            </p>
            <p className="mt-2">
              <strong>Precio oferta:</strong> ${offer.precioOferta}
            </p>
            <p className="mt-2">
              <strong>Fecha Inicio:</strong> {offer.fechaInicio}
            </p>
            <p className="mt-2">
              <strong>Fecha Fin:</strong> {offer.fechaFin}
            </p>
            <p className="mt-2">
              <strong>Fecha límite:</strong> {offer.fechaLimite}
            </p>
            <p className="mt-2">
              <strong>Descripción:</strong> {offer.descripcion}
            </p>
            <button
              onClick={() => handleBuy(offer)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offers;



