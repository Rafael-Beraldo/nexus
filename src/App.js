import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "./auth/stripeConfig";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./service/ProtectedRoute";

import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import Cart from "./pages/Cart";
import ProductPage from "./pages/ProductPage";
import Login from "./pages/Login";

function App() {
  const stripePromise = getStripe();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/user"
            element={<ProtectedRoute element={<UserPage />} />}
          />

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
    </AuthProvider>
  );
}

export default App;
