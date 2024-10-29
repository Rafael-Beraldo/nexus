import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      setCartItems(cart);
    } catch (error) {
      console.error('Erro ao buscar o carrinho:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleIncreaseQuantity = async (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
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
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  return (
    <div className="cartContainer">
      <h2>Carrinho de Compras</h2>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} className="cartItem">
              <img src={item.image} alt={item.title} style={{ width: 50, height: 50 }} />
              <div className="cartItemDetails">
                <h3>{item.title}</h3>
                <p>{`R$${(item.price * (item.quantity || 1)).toFixed(2)}`}</p> {/* Preço total */}
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
              <IconButton onClick={() => handleRemoveItem(index)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
