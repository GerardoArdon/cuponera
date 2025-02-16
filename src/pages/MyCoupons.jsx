import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { jsPDF } from "jspdf";

function MyCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }
        // Consulta a la colección "coupons" filtrando por userId
        const couponsRef = collection(db, "coupons");
        const q = query(couponsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const couponsArray = [];
        querySnapshot.forEach((doc) => {
          couponsArray.push({ id: doc.id, ...doc.data() });
        });
        setCoupons(couponsArray);
      } catch (err) {
        console.error("Error al obtener los cupones:", err);
        setError("Error al obtener los cupones");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Función para generar el PDF de un cupón
  const generatePDF = (coupon) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Cupón de Descuento", 10, 20);
    doc.setFontSize(12);
    doc.text(`Código: ${coupon.couponCode}`, 10, 40);
    doc.text(`Oferta ID: ${coupon.offerId}`, 10, 50);
    doc.text(`Estado: ${coupon.status}`, 10, 60);
    // Si purchaseDate es un Timestamp de Firebase, lo convertimos
    const purchaseDate = coupon.purchaseDate?.seconds
      ? new Date(coupon.purchaseDate.seconds * 1000).toLocaleString()
      : coupon.purchaseDate;
    doc.text(`Fecha de compra: ${purchaseDate}`, 10, 70);
    // Puedes agregar más información si lo deseas
    doc.save(`cupon_${coupon.couponCode}.pdf`);
  };

  if (loading) return <div className="container mx-auto p-4">Cargando cupones...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  // Separar los cupones según su estado
  const availableCoupons = coupons.filter(coupon => coupon.status === "disponible");
  const redeemedCoupons = coupons.filter(coupon => coupon.status === "canjeado");
  const expiredCoupons = coupons.filter(coupon => coupon.status === "vencido");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Mis Cupones</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Cupones Disponibles</h2>
        {availableCoupons.length === 0 ? (
          <p>No tienes cupones disponibles.</p>
        ) : (
          availableCoupons.map(coupon => (
            <div key={coupon.id} className="bg-white p-4 rounded shadow mb-2">
              <p><strong>Código:</strong> {coupon.couponCode}</p>
              <p><strong>Oferta ID:</strong> {coupon.offerId}</p>
              <p>
                <strong>Fecha de compra:</strong>{" "}
                {coupon.purchaseDate?.seconds
                  ? new Date(coupon.purchaseDate.seconds * 1000).toLocaleString()
                  : coupon.purchaseDate}
              </p>
              <button
                onClick={() => generatePDF(coupon)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generar PDF
              </button>
            </div>
          ))
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Cupones Canjeados</h2>
        {redeemedCoupons.length === 0 ? (
          <p>No tienes cupones canjeados.</p>
        ) : (
          redeemedCoupons.map(coupon => (
            <div key={coupon.id} className="bg-white p-4 rounded shadow mb-2">
              <p><strong>Código:</strong> {coupon.couponCode}</p>
              <p><strong>Oferta ID:</strong> {coupon.offerId}</p>
              <p>
                <strong>Fecha de compra:</strong>{" "}
                {coupon.purchaseDate?.seconds
                  ? new Date(coupon.purchaseDate.seconds * 1000).toLocaleString()
                  : coupon.purchaseDate}
              </p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Cupones Vencidos</h2>
        {expiredCoupons.length === 0 ? (
          <p>No tienes cupones vencidos.</p>
        ) : (
          expiredCoupons.map(coupon => (
            <div key={coupon.id} className="bg-white p-4 rounded shadow mb-2">
              <p><strong>Código:</strong> {coupon.couponCode}</p>
              <p><strong>Oferta ID:</strong> {coupon.offerId}</p>
              <p>
                <strong>Fecha de compra:</strong>{" "}
                {coupon.purchaseDate?.seconds
                  ? new Date(coupon.purchaseDate.seconds * 1000).toLocaleString()
                  : coupon.purchaseDate}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default MyCoupons;


