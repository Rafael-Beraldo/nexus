import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ProductPage.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import logo from "../assets/logo.png";
import { AuthContext } from "../auth/AuthContext";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

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
        const response = await fetch(
          `https://nexus-backend-latest.onrender.com/api/Product/${id}`
        );
        const data = await response.json();
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

  const createOrderInBackend = async (paymentDetails) => {
    try {
      const orderData = {
        userId: user.id,
        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity: installments,
            price: product.price,
          },
        ],
        createdAt: new Date().toISOString(),
        status: "AGUARDANDO",
      };

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
        throw new Error("Erro ao criar o pedido no backend.");
      }

      alert("Transação concluída com sucesso! Pedido registrado.");
      navigate("/order");
    } catch (error) {
      console.error("Erro ao criar pedido:", error.message);
      alert("Erro ao registrar pedido. Tente novamente.");
    }
  };

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
      <div className="productPage">
        <div className="productContainer">
          <div className="imageContainer">
            {product.imageUrl ? (
              <img
                src={`https://nexus-backend-latest.onrender.com${product.imageUrl}`}
                alt={product.name}
                className="productImagem"
              />
            ) : (
              <p>Imagem não disponível</p>
            )}
          </div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          {user && user.isAdmin ? (
            <div className="container-button">
              <button className="btn-form" onClick={handleEdit}>
                Editar
              </button>
            </div>
          ) : null}
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
                createOrderInBackend(details);
              });
            }}
          />
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default ProductPage;
