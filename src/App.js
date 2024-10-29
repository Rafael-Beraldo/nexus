// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import UserPage from "./pages/UserPage"; 
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPage />} />{" "}
        <Route path="/cart" element={<Cart />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
