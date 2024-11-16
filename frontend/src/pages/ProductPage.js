import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ProductPage.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [installments, setInstallments] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const initialOptions = {
    clientId:
      "AaKfNymjl48o2itp9lUil3FuP80HdjrFAd_yk6YQofIETcAPirvuYrwXRuVxW_nZXIJHCGTMFdpu5XGA",
    currency: "BRL",
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5047/api/Product/${id}`);
        const data = await response.json();
        console.log(data);
        setProduct(data);
        setTotalPrice(data.price);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setTotalPrice((product.price * installments).toFixed(2));
    }
  }, [installments, product]);

  if (!product) return <div>Carregando...</div>;

  const handleEdit = () => {
    navigate("/product/form", { state: { product } });
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
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
            {product.imageUrl ? (
              <img
                src={`http://localhost:5047/${product.imageUrl}`}
                alt={product.name}
                className="productImage"
              />
            ) : (
              <p>Imagem não disponível</p>
            )}
          </div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="container-button">
            <button className="btn-form" onClick={handleEdit}>
              Editar
            </button>
          </div>
        </div>
        <div className="pagamentoContainer">
          <form>
            <div className="headerPayment">
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.5)" }}>Produto:</p>
              <h1>{product.name}</h1>
              <label className="priceProduct">
                {product.price !== undefined
                  ? `R$${product.price.toFixed(2)}`
                  : "Preço não disponível"}
              </label>
            </div>
            <div>
              <label className="textParcela">Quantidade de Produto(s):</label>
              <input
                type="number"
                value={installments}
                className="inputProductPage"
                onChange={(e) => setInstallments(Number(e.target.value))}
                min="1"
              />
            </div>
            <div className="totalPrice">
              <p>
                Total a pagar (em {installments} parcela(s)):{" "}
                {product.price !== undefined
                  ? `R$${totalPrice}`
                  : "Preço não disponível"}
              </p>
            </div>
          </form>

          <div id="paypal-button-container" className="containerBtn"></div>
          <PayPalButtons
            key={totalPrice}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: totalPrice.toString(),
                    },
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
      </div>
    </PayPalScriptProvider>
  );
};

export default ProductPage;
