// src/pages/Offers.jsx
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

function Offers() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiration, setCardExpiration] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [buyerDUI, setBuyerDUI] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const promotionsRef = collection(db, "promotions");
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

  const handleShowPaymentModal = (offer) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión o registrarte para comprar cupones.");
      return;
    }

    setSelectedOffer(offer);
    setQuantity(1);
    setCardNumber("");
    setCardExpiration("");
    setCardCVV("");
    setBuyerDUI("");
    setShowPaymentModal(true);
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedOffer(null);
  };

  const handleConfirmPayment = async () => {
    if (!cardNumber || !cardExpiration || !cardCVV || !buyerDUI) {
      alert("Por favor, completa todos los datos de la tarjeta y el DUI.");
      return;
    }
    if (quantity < 1) {
      alert("Debes comprar al menos un cupón.");
      return;
    }

    setPaymentLoading(true);

    setTimeout(async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Debes iniciar sesión para comprar cupones.");
        setPaymentLoading(false);
        setShowPaymentModal(false);
        return;
      }
      try {
        for (let i = 0; i < quantity; i++) {
          const codigoEmpresa = selectedOffer.codigoEmpresa || "DEF";
          const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
          const couponCode = `${codigoEmpresa}${randomNumber}`;

          await addDoc(collection(db, "coupons"), {
            couponCode,
            offerId: selectedOffer.id,
            userId: user.uid,
            userEmail: user.email,
            purchaseDate: new Date(),
            status: "disponible",
            buyerDUI,
            promotionTitle: selectedOffer.titulo,
            promotionExpiration: selectedOffer.fechaLimite,
          });
        }
        alert(`Pago confirmado. Se ha enviado un correo de confirmación a ${user.email}.`);
      } catch (err) {
        console.error("Error generando los cupones:", err);
        alert("Error al procesar la compra. Inténtalo de nuevo.");
      } finally {
        setPaymentLoading(false);
        setShowPaymentModal(false);
      }
    }, 2000);
  };

  if (loading) return <div className="container mx-auto p-4">Cargando ofertas...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Barra superior */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/mycoupons"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Mis Cupones
        </Link>

        {/* Sección de cuenta */}
        {user ? (
          <button
            onClick={() => {
              auth.signOut().then(() => window.location.reload());
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        ) : (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-4">Ofertas Activas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{offer.titulo}</h2>
            <p className="text-gray-600"><strong>Rubro:</strong> {offer.rubro}</p>
            <p><strong>Precio regular:</strong> ${offer.precioRegular}</p>
            <p><strong>Precio oferta:</strong> ${offer.precioOferta}</p>
            <p><strong>Fecha Inicio:</strong> {offer.fechaInicio}</p>
            <p><strong>Fecha Fin:</strong> {offer.fechaFin}</p>
            <p><strong>Fecha límite:</strong> {offer.fechaLimite}</p>
            <p><strong>Descripción:</strong> {offer.descripcion}</p>

            <button
              onClick={() => handleShowPaymentModal(offer)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* Modal de pago */}
      {showPaymentModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Confirmar Compra</h2>
            <p><strong>Oferta:</strong> {selectedOffer.titulo}</p>

            <div className="mb-2">
              <label className="block mb-1">Cantidad de cupones:</label>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Número de tarjeta:</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Fecha de expiración:</label>
              <input
                type="text"
                value={cardExpiration}
                onChange={(e) => setCardExpiration(e.target.value)}
                placeholder="MM/AA"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">CVV:</label>
              <input
                type="text"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">DUI:</label>
              <input
                type="text"
                value={buyerDUI}
                onChange={(e) => setBuyerDUI(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleCancelPayment}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                disabled={paymentLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={paymentLoading}
              >
                {paymentLoading ? "Procesando..." : "Confirmar Pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;
