// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "./auth/stripeConfig"; // Ajuste conforme sua configuração do Stripe

import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import Cart from "./pages/Cart";
import ProductPage from "./pages/ProductPage";

function App() {
  const stripePromise = getStripe();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/produto/:id"
          element={
            <Elements stripe={stripePromise}>
              <ProductPage />
            </Elements>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
