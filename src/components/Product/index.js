import React from "react";
import "./style.css";
import iphomeImg from "../../assets/iphone.png";

const Product = ({ product }) => {
  return (
    <div className="productCard">
      <img
        src={product.image || iphomeImg}
        alt={product.title}
        style={{ margin: "0 auto", width: "80%", height: 200 }}
      />
      <h3>{product.title}</h3>
      <p className="strikeThrough">{`R$${(product.price + 1).toFixed(2)}`}</p>{" "}
      <p className="priceProduct">{`R$${product.price.toFixed(2)}`}</p>
      <h2 className="font-s">{`10x de R$ ${(product.price / 10).toFixed(
        2
      )} sem juros`}</h2>
      <span>
        Até R$459,90 <br />
      </span>
      <button className="btnAddToCart">Adicionar no carrinho</button>
    </div>
  );
};

export default Product;
