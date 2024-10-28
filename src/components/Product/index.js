import React from "react";

import "./style.css";

import iphomeImg from "../../assets/iphone.png";

const Product = (props) => {
  const truncateTitle = (title) => {
    return title.length > 25 ? `${title.slice(0, 15)}...` : title;
  };

  return (
    <>
      <div className="productCard">
        <img
          src={props.product.image || iphomeImg}
          alt={props.product.title}
          style={{ margin: "0 auto", width: "80%", height: 200 }}
        />
        <h3>{truncateTitle(props.product.title)}</h3>{" "}
        {/* Aqui aplicamos a função */}
        <p className="strikeThrough">{`R$${(props.product.price + 1).toFixed(
          2
        )}`}</p>{" "}
        <p className="priceProduct">{`R$${props.product.price.toFixed(2)}`}</p>
        <h2 className="font-s">{`10x de R$ ${(props.product.price / 10).toFixed(
          2
        )} sem juros`}</h2>
        <span>
          {`Até R$${(props.product.price / 10).toFixed(2)}`} <br />
        </span>
        <button
          onClick={() => {
            console.log("oi");
          }}
          className="btnAddToCart"
        >
          Adicionar no carrinho
        </button>
      </div>
    </>
  );
};

export default Product;
