import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Offers from "./pages/Offers";
import MyCoupons from "./pages/MyCoupons";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/mycoupons" element={<MyCoupons />} />
      </Routes>
    </Router>
  );
}

export default App;


