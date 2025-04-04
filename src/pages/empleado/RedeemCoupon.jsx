import React, { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

function RedeemCoupon() {
  const [couponCode, setCouponCode] = useState("");
  const [buyerDUI, setBuyerDUI] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRedeem = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCouponData(null);

    if (!couponCode || !buyerDUI) {
      setError("Por favor, ingrese el código y el DUI.");
      return;
    }
    
    setLoading(true);
    try {
      //Buscamos el cupón en la colección "coupons" de firbebase filtrando por codigo de cupon
      const couponsRef = collection(db, "coupons");
      const q = query(couponsRef, where("couponCode", "==", couponCode));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("Cupón no encontrado.");
        setLoading(false);
        return;
      }
      let coupon = null;
      querySnapshot.forEach((docSnap) => {
        coupon = { id: docSnap.id, ...docSnap.data() };
      });
      if (!coupon) {
        setError("Cupón no encontrado.");
        setLoading(false);
        return;
      }
      if (coupon.status !== "disponible") {
        setError("Este cupón ya ha sido canjeado o no está disponible.");
        setLoading(false);
        return;
      }


      //Verificamos que el DUI almacenado en el cupón coincida con el ingresado
      if (coupon.buyerDUI !== buyerDUI) {
        setError("El DUI no coincide con el del comprador.");
        setLoading(false);
        return;
      }


      //actualizamos el estado del cupón a "canjeado"
      const couponDocRef = doc(db, "coupons", coupon.id);
      await updateDoc(couponDocRef, { status: "canjeado" });
      setSuccess("Cupón canjeado exitosamente.");
      setCouponData(coupon);
    } catch (err) {
      console.error("Error al canjear el cupón:", err);
      setError("Error al canjear el cupón. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Canje de Cupón</h1>
      <form onSubmit={handleRedeem} className="bg-white p-4 rounded shadow max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-1">Código del cupón:</label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">DUI del comprador:</label>
          <input
            type="text"
            value={buyerDUI}
            onChange={(e) => setBuyerDUI(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Procesando..." : "Canjear Cupón"}
        </button>
      </form>
      {couponData && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold">Información del Cupón</h2>
          <p><strong>Código:</strong> {couponData.couponCode}</p>
          <p><strong>Oferta ID:</strong> {couponData.offerId}</p>
          <p><strong>Promoción:</strong> {couponData.promotionTitle}</p>
          <p>
            <strong>Fecha de compra:</strong>{" "}
            {couponData.purchaseDate?.seconds
              ? new Date(couponData.purchaseDate.seconds * 1000).toLocaleString()
              : couponData.purchaseDate}
          </p>
          <p><strong>Estado:</strong> {couponData.status}</p>
        </div>
      )}
    </div>
  );
}

export default RedeemCoupon;
