import React, { useEffect, useState } from "react";

import "./ProductPage.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useParams, useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import getStripe from "../auth/stripeConfig";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState(1000); // 1000 (R$ 10,00)
  const [installments, setInstallments] = useState(1);
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        setProduct(data);

        const paymentResponse = await fetch(
          "http://localhost:4242/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: amount }),
          }
        );

        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.clientSecret);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    };

    fetchProduct();
  }, [id, amount]);

  if (!product) return <div>Carregando...</div>;

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!clientSecret) {
      alert("Erro ao obter o clientSecret.");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      alert(`Erro ao processar pagamento: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      alert("Pagamento realizado com sucesso!");
    }
  };

  return (
    <>
      <header className="headerProduct">
        <div style={{ paddingLeft: "2%" }}>
          <ArrowBackIcon
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
        </div>
      </header>
      <div className="productPage">
        <div className="productContainer">
          <div className="imageContainer">
            <img
              src={product.image}
              alt={product.title}
              className="productImage"
            />
          </div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
        </div>
        <div className="pagamentoContainer">
          <Elements stripe={getStripe()}>
            <form onSubmit={handlePayment}>
              <div className="headerPayment">
                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.5)" }}>
                  Produto:
                </p>
                <h1>{product.title}</h1>
                <label className="priceProduct">{`R$${product.price.toFixed(
                  2
                )}`}</label>
              </div>
              <div className="">
                <label className="textParcela">Parcela(s):</label>
                <input
                  type="number"
                  value={installments}
                  className="inputProductPage"
                  onChange={(e) => setInstallments(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <CardElement />
              </div>
              <div className="containerBtn">
                <button
                  type="submit"
                  disabled={!stripe}
                  className="btnProductPage"
                >
                  Comprar
                </button>
              </div>
            </form>
          </Elements>
        </div>
      </div>
    </>
  );
};

export default ProductPage;