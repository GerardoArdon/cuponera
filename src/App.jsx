import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Offers from "./pages/Offers";
import MyCoupons from "./pages/MyCoupons";
import RedeemCoupon from "./pages/RedeemCoupon"; // Asegúrate de importar el componente

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/mycoupons" element={<MyCoupons />} />
        <Route path="/redeem-coupon" element={<RedeemCoupon />} />
      </Routes>
    </Router>
  );
}

export default App;



