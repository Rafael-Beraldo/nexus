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

import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const existingCart = await AsyncStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];
      setCartItems(cart);
    } catch (error) {
      console.error("Erro ao buscar o carrinho:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleIncreaseQuantity = async (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

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

  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.price * (item.quantity || 1);
  }, 0);

  return (
    <>
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
        {cartItems.length === 0 ? (
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
          </>
        )}
      </div>
    </>
  );
};

export default Cart;