import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiration, setCardExpiration] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Obtener promociones desde Firestore
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

  // Abre el modal de pago para la oferta seleccionada
  const handleShowPaymentModal = (offer) => {
    setSelectedOffer(offer);
    setQuantity(1);
    setCardNumber("");
    setCardExpiration("");
    setCardCVV("");
    setShowPaymentModal(true);
  };

  // Cierra el modal de pago
  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedOffer(null);
  };

  // Maneja la confirmación del pago
  const handleConfirmPayment = async () => {
    // Validaciones básicas de los datos de pago
    if (!cardNumber || !cardExpiration || !cardCVV) {
      alert("Por favor, completa los datos de la tarjeta.");
      return;
    }
    if (quantity < 1) {
      alert("Debes comprar al menos un cupón.");
      return;
    }
    setPaymentLoading(true);

    // Simular procesamiento del pago (puedes integrar Stripe u otro servicio en producción)
    setTimeout(async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Debes iniciar sesión para comprar cupones.");
        setPaymentLoading(false);
        setShowPaymentModal(false);
        return;
      }
      try {
        // Generar un documento en la colección "coupons" por cada cupón solicitado
        for (let i = 0; i < quantity; i++) {
          const codigoEmpresa = selectedOffer.codigoEmpresa || "DEF";
          const randomNumber = Math.floor(Math.random() * 9000000) + 1000000; // Número aleatorio de 7 dígitos
          const couponCode = `${codigoEmpresa}${randomNumber}`;

          await addDoc(collection(db, "coupons"), {
            couponCode,          // Código único del cupón
            offerId: selectedOffer.id, // ID de la promoción
            userId: user.uid,    // ID del usuario que compra
            purchaseDate: new Date(),
            status: "disponible" // Estado inicial del cupón
          });
        }
        // Simula el envío de un correo electrónico al cliente
        alert(`Pago confirmado. Se ha enviado un correo de confirmación a ${user.email}.`);
      } catch (err) {
        console.error("Error generando los cupones:", err);
        alert("Error al procesar la compra. Inténtalo de nuevo.");
      } finally {
        setPaymentLoading(false);
        setShowPaymentModal(false);
      }
    }, 2000); // Simula 2 segundos de procesamiento
  };

  if (loading) {
    return <div className="container mx-auto p-4">Cargando ofertas...</div>;
  }
  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Confirmar Compra</h2>
            <p className="mb-2">
              <strong>Oferta:</strong> {selectedOffer.titulo}
            </p>
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




