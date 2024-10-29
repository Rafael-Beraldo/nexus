// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import UserPage from "./pages/UserPage"; // Importe a nova página do usuário
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPage />} />{" "}
        <Route path="/cart" element={<Cart />} />{" "}
        {/* Define a rota de usuário */}
      </Routes>
    </Router>
  );
}

export default App;
