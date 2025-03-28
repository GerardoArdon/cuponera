import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

function GestionPromociones() {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchPromos = async () => {
    setLoading(true);
    const promoSnap = await getDocs(collection(db, "promotions"));
    const promoList = [];
    promoSnap.forEach((doc) => {
      promoList.push({ id: doc.id, ...doc.data() });
    });
    setPromociones(promoList);
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const cambiarEstado = async (id, nuevoEstado, razon = "") => {
    const promoRef = doc(db, "promotions", id);
    await updateDoc(promoRef, {
      estado: nuevoEstado,
      razonRechazo: razon,
    });
    fetchPromos();
    setSelectedPromoId(null);
    setRejectionReason("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestión de Promociones</h1>

      {loading ? (
        <p>Cargando promociones...</p>
      ) : (
        <div className="grid gap-4">
          {promociones.length === 0 ? (
            <p>No hay promociones registradas.</p>
          ) : (
            promociones.map((promo) => (
              <div key={promo.id} className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-bold">{promo.titulo}</h2>
                <p><strong>Empresa:</strong> {promo.codigoEmpresa}</p>
                <p><strong>Estado:</strong> {promo.estado}</p>
                <p><strong>Precio Oferta:</strong> ${promo.precioOferta}</p>
                <p><strong>Precio Regular:</strong> ${promo.precioRegular}</p>
                <p><strong>Descripción:</strong> {promo.descripcion}</p>
                <p><strong>Fecha Inicio:</strong> {promo.fechaInicio}</p>
                <p><strong>Fecha Fin:</strong> {promo.fechaFin}</p>
                <p><strong>Fecha Límite:</strong> {promo.fechaLimite}</p>
                {promo.razonRechazo && (
                  <p className="text-red-600"><strong>Razón de rechazo:</strong> {promo.razonRechazo}</p>
                )}

                <div className="flex gap-2 mt-4">
                  {promo.estado === "En espera de aprobación" && (
                    <>
                      <button
                        onClick={() => cambiarEstado(promo.id, "Oferta aprobada")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => setSelectedPromoId(promo.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {promo.estado === "Oferta rechazada" && (
                    <button
                      onClick={() => cambiarEstado(promo.id, "Oferta descartada")}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Descartar
                    </button>
                  )}
                </div>

                {/* Rechazo con motivo */}
                {selectedPromoId === promo.id && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Motivo del rechazo"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <button
                      onClick={() => cambiarEstado(promo.id, "Oferta rechazada", rejectionReason)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Confirmar Rechazo
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default GestionPromociones;
