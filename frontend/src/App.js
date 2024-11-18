import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./service/ProtectedRoute";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import Cart from "./pages/Cart";
import ProductPage from "./pages/ProductPage";
import Login from "./pages/Login";
import UserForm from "./pages/UserForm";
import ProductForm from "./pages/ProductForm";
import Order from "./pages/Order";
import OrderDetail from "./pages/OrderDetail";
function App() {
  const initialOptions = {
    clientId:
      "AaKfNymjl48o2itp9lUil3FuP80HdjrFAd_yk6YQofIETcAPirvuYrwXRuVxW_nZXIJHCGTMFdpu5XGA",
    currency: "BRL",
  };

  return (
    <AuthProvider>
      <PayPalScriptProvider options={initialOptions}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user/form" element={<UserForm />} />
            <Route path="/product/form" element={<ProductForm />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/:id" element={<OrderDetail />} />

            <Route
              path="/user"
              element={<ProtectedRoute element={<UserPage />} />}
            />

            <Route path="/produto/:id" element={<ProductPage />} />
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}

export default App;
