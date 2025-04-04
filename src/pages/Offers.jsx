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
  const [rubros, setRubros] = useState([]);
  const [selectedRubro, setSelectedRubro] = useState("Todos");
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
    const fetchData = async () => {
      try {
        const rubrosSnapshot = await getDocs(collection(db, "rubros"));
        const rubrosList = rubrosSnapshot.docs.map((doc) => doc.data().nombre);
        setRubros(["Todos", ...rubrosList]);

        const q = query(collection(db, "promotions"), where("estado", "==", "Oferta aprobada"));
        const querySnapshot = await getDocs(q);
        const promos = [];
        querySnapshot.forEach((doc) => {
          promos.push({ id: doc.id, ...doc.data() });
        });
        setOffers(promos);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Error al obtener las promociones");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOffers =
    selectedRubro === "Todos"
      ? offers
      : offers.filter((offer) => offer.rubro === selectedRubro);

  const handleShowPaymentModal = (offer) => {
    if (!auth.currentUser) {
      alert("Debes iniciar sesión o registrarte para comprar cupones.");
      return;
    }
    setSelectedOffer(offer);
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

    setPaymentLoading(true);
    const user = auth.currentUser;

    setTimeout(async () => {
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
        console.error("Error al generar los cupones:", err);
        alert("Error al procesar la compra.");
      } finally {
        setPaymentLoading(false);
        setShowPaymentModal(false);
      }
    }, 1500);
  };

  if (loading) return <div className="p-6 text-center">Cargando ofertas...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/mycoupons" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Mis Cupones
        </Link>

        {user ? (
          <button
            onClick={() => auth.signOut().then(() => window.location.reload())}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Registrarse
            </Link>
          </div>
        )}
      </div>

      {/* Filtro por rubro */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Filtrar por rubro:</label>
        <select
          value={selectedRubro}
          onChange={(e) => setSelectedRubro(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
        >
          {rubros.map((rubro, index) => (
            <option key={index} value={rubro}>
              {rubro}
            </option>
          ))}
        </select>
      </div>

      {/* Ofertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 shadow-md relative"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg"></div>
            <h2 className="text-xl font-bold text-gray-800">{offer.titulo}</h2>
            <p className="text-sm text-gray-600 mb-2"><strong>Rubro:</strong> {offer.rubro}</p>
            <p><strong>Precio Regular:</strong> ${offer.precioRegular}</p>
            <p><strong>Precio Oferta:</strong> ${offer.precioOferta}</p>
            <p><strong>Vigencia:</strong> {offer.fechaInicio} - {offer.fechaFin}</p>
            <p><strong>Fecha límite:</strong> {offer.fechaLimite}</p>
            <p className="mt-2"><strong>Descripción:</strong> {offer.descripcion}</p>

            <button
              onClick={() => handleShowPaymentModal(offer)}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            >
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* Modal de pago */}
      {showPaymentModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirmar Compra</h2>
            <p><strong>Oferta:</strong> {selectedOffer.titulo}</p>

            <div className="grid gap-2 mt-4">
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="p-2 border rounded"
                placeholder="Cantidad de cupones"
              />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="p-2 border rounded"
                placeholder="Número de tarjeta"
              />
              <input
                type="text"
                value={cardExpiration}
                onChange={(e) => setCardExpiration(e.target.value)}
                className="p-2 border rounded"
                placeholder="Fecha expiración (MM/AA)"
              />
              <input
                type="text"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
                className="p-2 border rounded"
                placeholder="CVV"
              />
              <input
                type="text"
                value={buyerDUI}
                onChange={(e) => setBuyerDUI(e.target.value)}
                className="p-2 border rounded"
                placeholder="DUI"
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handleCancelPayment}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={paymentLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPayment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

