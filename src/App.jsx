// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Offers from "./pages/Offers";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyCoupons from "./pages/MyCoupons";
import RedeemCoupon from "./pages/RedeemCoupon";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import GestionEmpresas from "./pages/admin/GestionEmpresas";
import GestionPromociones from "./pages/admin/GestionPromociones";
import GestionRubros from "./pages/admin/GestionRubros";
import GestionClientes from "./pages/admin/GestionClientes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Offers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mycoupons" element={<MyCoupons />} />
        <Route path="/redeem" element={<RedeemCoupon />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/empresas" element={<GestionEmpresas />} />
        <Route path="/admin/promociones" element={<GestionPromociones />} />
        <Route path="/admin/rubros" element={<GestionRubros />} />
        <Route path="/admin/clientes" element={<GestionClientes />} />
      </Routes>
    </Router>
  );
}

export default App;
