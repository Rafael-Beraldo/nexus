import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Cart.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import logo from "../assets/logo.png";
import { AuthContext } from "../auth/AuthContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const initialOptions = {
    clientId:
      "AaKfNymjl48o2itp9lUil3FuP80HdjrFAd_yk6YQofIETcAPirvuYrwXRuVxW_nZXIJHCGTMFdpu5XGA",
    currency: "BRL",
  };

  useEffect(() => {
    const loadCartItems = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };

    loadCartItems();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    };

    calculateTotal();
  }, [cartItems]);

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const createOrderInBackend = async (paymentDetails) => {
    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        userId: user.id,
        items,
        createdAt: new Date().toISOString(),
        status: "APROVADO",
      };

      if (user && user.id) {
        const response = await fetch(
          "https://nexus-backend-latest.onrender.com/api/Order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao criar o pedido.");
        }

        alert("Transação concluída com sucesso! Pedido registrado.");
        localStorage.removeItem("cart");
        navigate("/order");
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error.message);
      alert("Erro ao criar o pedido. Tente novamente.");
    }
  };

  if (cartItems.length === 0)
    return (
      <>
        <div className="profile-header">
          <div style={{ paddingLeft: "2%" }}>
            <ArrowBackIcon
              fontSize="small"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
            <img
              src={logo}
              alt="Logo"
              style={{
                marginBottom: -20,
                marginLeft: 20,
                width: 200,
                height: 60,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            />
          </div>
        </div>
        <div>Seu carrinho está vazio</div>
      </>
    );

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="profile-header">
        <div style={{ paddingLeft: "2%" }}>
          <ArrowBackIcon
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <img
            src={logo}
            alt="Logo"
            style={{
              marginBottom: -20,
              marginLeft: 20,
              width: 200,
              height: 60,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          />
        </div>
      </div>
      <div className="cartPage">
        <div className="cartContainer">
          {cartItems.map((item) => (
            <div key={item.id} className="cartItem">
              <div className="imageContainer">
                {item.imageUrl ? (
                  <img
                    src={`https://nexus-backend-latest.onrender.com//${item.imageUrl}`}
                    alt={item.name}
                    className="productImage"
                  />
                ) : (
                  <p>Imagem não disponível</p>
                )}
              </div>
              <div className="cartItemDetails">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <label className="priceProduct">
                  R${item.price.toFixed(2)}
                </label>
                <div>
                  <label>Quantidade:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedCart = cartItems.map((cartItem) =>
                        cartItem.id === item.id
                          ? { ...cartItem, quantity: Number(e.target.value) }
                          : cartItem
                      );
                      setCartItems(updatedCart);
                      localStorage.setItem("cart", JSON.stringify(updatedCart));
                    }}
                    min="1"
                  />
                </div>
                <DeleteIcon
                  className="removeButton"
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="totalPrice">
          <p>Total a pagar: R${totalPrice.toFixed(2)}</p>
        </div>

        <div id="paypal-button-container" className="containerBtn"></div>
        <PayPalButtons
          key={totalPrice}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalPrice.toFixed(2), // Corrigido para garantir que tenha duas casas decimais
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              createOrderInBackend(details);
            });
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default CartPage;
