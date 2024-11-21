import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./style.css";
import { Link } from "react-router-dom";

const Product = (props) => {
  if (!props.product) {
    return <div>Produto não encontrado</div>;
  }

  const { imageUrl, name, price, id } = props.product;

  const truncateName = (name) => {
    if (!name) {
      return "";
    }
    return name.length > 15 ? `${name.slice(0, 12)}...` : name;
  };

  const addToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];

      const existingItemIndex = cart.findIndex((item) => item.id === id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        const newItem = { ...props.product, quantity: 1 };
        cart.push(newItem);
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      console.log("Produto adicionado ao carrinho:", props.product);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  return (
    <div className="productCard">
      <Link to={`/produto/${id}`} className="product-link">
        {console.log(imageUrl)}
        <img
          src={`https://nexus-backend-latest.onrender.com//${imageUrl}`}
          alt={props.product.title || "Imagem do Produto"}
          style={{ margin: "0 auto", width: "80%", height: 200 }}
        />
        <h3>{truncateName(name)}</h3>
        <p className="strikeThrough">{`R$${(price + 1).toFixed(2)}`}</p>
        <p className="priceProduct">{`R$${price.toFixed(2)}`}</p>
        <h2 className="font-s">{`10x de R$ ${(price / 10).toFixed(
          2
        )} sem juros`}</h2>
        <span>
          {`Até R$${(price / 10).toFixed(2)}`} <br />
        </span>
      </Link>
      <button onClick={addToCart} className="btnAddToCart">
        Adicionar no carrinho
      </button>
    </div>
  );
};

export default Product;
