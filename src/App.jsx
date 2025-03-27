// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Offers from "./pages/Offers";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyCoupons from "./pages/MyCoupons";
import RedeemCoupon from "./pages/RedeemCoupon";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Offers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mycoupons" element={<MyCoupons />} />
        <Route path="/redeem" element={<RedeemCoupon />} />
      </Routes>
    </Router>
  );
}

export default App;