import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Cliente
import Offers from "./pages/cliente/Offers";
import Register from "./pages/cliente/Register";
import Login from "./pages/cliente/Login";
import MyCoupons from "./pages/cliente/MyCoupons";

//Empleado - Redimir cupones
import EmpleadoLogin from "./pages/empleado/EmpleadoLogin";
import RedeemCoupon from "./pages/empleado/RedeemCoupon";

//Administrador de La Cuponera
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import GestionEmpresas from "./pages/admin/GestionEmpresas";
import GestionPromociones from "./pages/admin/GestionPromociones";
import GestionRubros from "./pages/admin/GestionRubros";
import GestionClientes from "./pages/admin/GestionClientes";

//Empresa Ofertante
import EmpresaDashboard from "./pages/empresa/EmpresaDashboard";
import GestionOfertas from "./pages/empresa/GestionOfertas";
import GestionEmpleados from "./pages/empresa/GestionEmpleados";
import EmpresaLogin from "./pages/empresa/EmpresaLogin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Offers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mycoupons" element={<MyCoupons />} />

        {/* Empleado para redimir codigo */}
        <Route path="/redeem" element={<RedeemCoupon />} />
        <Route path="/empleado/login" element={<EmpleadoLogin />} />

        {/* Admin de La Cuponera */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/empresas" element={<GestionEmpresas />} />
        <Route path="/admin/promociones" element={<GestionPromociones />} />
        <Route path="/admin/rubros" element={<GestionRubros />} />
        <Route path="/admin/clientes" element={<GestionClientes />} />

        {/* Admin de Empresa Ofertante */}
        <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
        <Route path="/empresa/ofertas" element={<GestionOfertas />} />
        <Route path="/empresa/empleados" element={<GestionEmpleados />} />
        <Route path="/empresa/login" element={<EmpresaLogin />} />
      </Routes>
    </Router>
  );
}

export default App;

