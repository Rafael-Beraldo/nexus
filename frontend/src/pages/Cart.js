import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton } from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import logo from "../assets/logo.png";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar os itens do carrinho
  const fetchCartItems = async () => {
    try {
      const existingCart = await AsyncStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];
      setCartItems(cart);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar o carrinho:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calcular o total do carrinho
  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.price * (item.quantity || 1);
  }, 0);

  // Função para remover item do carrinho
  const handleRemoveItem = async (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Função para aumentar a quantidade de um item
  const handleIncreaseQuantity = async (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Função para diminuir a quantidade de um item
  const handleDecreaseQuantity = async (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      handleRemoveItem(index);
      return;
    }
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const initialOptions = {
    clientId:
      "AaKfNymjl48o2itp9lUil3FuP80HdjrFAd_yk6YQofIETcAPirvuYrwXRuVxW_nZXIJHCGTMFdpu5XGA",
    currency: "BRL",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <header className="headerCart">
        <div className="headerLeft">
          <ArrowIcon
            fontSize="small"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
          <img
            src={logo}
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
        <div className="headerRight">
          <PersonIcon
            style={{ width: 35, height: 35, cursor: "pointer" }}
            onClick={() => navigate("/user")}
          />
        </div>
      </header>

      <div className="cartContainer">
        <h2>Carrinho de Compras</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : cartItems.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} className="cartItem">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: 50, height: 50 }}
                  />
                  <div className="cartItemDetails">
                    <h3>{item.title}</h3>
                    <p>{`R$${(item.price * (item.quantity || 1)).toFixed(
                      2
                    )}`}</p>
                    <div className="quantityControls">
                      <IconButton onClick={() => handleDecreaseQuantity(index)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <span>{item.quantity || 1}</span>
                      <IconButton onClick={() => handleIncreaseQuantity(index)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                  <IconButton
                    onClick={() => handleRemoveItem(index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              ))}
            </ul>

            <div className="cartTotal">
              <h3>Total: R${totalAmount.toFixed(2)}</h3>
            </div>

            <div className="paypalContainer">
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        reference_id: "default",
                        amount: {
                          currency_code: "BRL",
                          value: totalAmount.toFixed(2),
                          breakdown: {
                            item_total: {
                              currency_code: "BRL",
                              value: totalAmount.toFixed(2),
                            },
                          },
                        },
                        items: cartItems.map((item) => ({
                          name: item.title,
                          quantity: item.quantity || 1, // Quantidade do item
                          unit_amount: {
                            currency_code: "BRL",
                            value: item.price.toFixed(2), // Preço unitário
                          },
                          total_amount: {
                            currency_code: "BRL",
                            value: (item.price * (item.quantity || 1)).toFixed(
                              2
                            ), // Valor total do item
                          },
                        })),
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert("Transação concluída com sucesso!");
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default Cart;
