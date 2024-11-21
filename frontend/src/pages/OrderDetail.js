import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "../assets/logo.png";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams(); // Captura o ID do pedido da URL
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `https://nexus-backend-latest.onrender.com/api/Order/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar detalhes do pedido.");
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token]);

  const calculateTotalAmount = (items) => {
    return (
      items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0
    );
  };

  return (
    <div>
      <div className="profile-header">
        <ArrowBackIcon
          fontSize="small"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)} // Retorna à página anterior
        />
        <img
          src={logo}
          alt="Logo"
          style={{
            marginLeft: 20,
            width: 200,
            height: 60,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />
      </div>
      <div className="order-detail-container">
        <div className="order-detail">
          {loading ? (
            <p className="loading-text">Carregando detalhes do pedido...</p>
          ) : error ? (
            <p className="error-text">Erro ao carregar pedido: {error}</p>
          ) : order ? (
            <>
              <h2>Detalhes do Pedido #{order.id}</h2>
              <div className="order-info">
                <p>
                  <strong>Data:</strong>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "Data indisponível"}
                </p>
                <p>
                  <strong>Status:</strong> {order.status || "Indefinido"}
                </p>
                <p>
                  <strong>Total:</strong> R$
                  {calculateTotalAmount(order.items).toFixed(2)}
                </p>
              </div>
              <div className="order-items">
                <h3>Itens do Pedido</h3>
                {order.items?.map((item) => (
                  <div className="order-item" key={item.id}>
                    <p>
                      <strong>Produto:</strong>{" "}
                      {item.productName || "Indisponível"}
                    </p>
                    <p>
                      <strong>Quantidade:</strong> {item.quantity || 0}
                    </p>
                    <p>
                      <strong>Preço Unitário:</strong> R$
                      {item.price?.toFixed(2) || "0.00"}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> R$
                      {(item.price * item.quantity)?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                )) || <p>Nenhum item encontrado.</p>}
              </div>
            </>
          ) : (
            <p>Nenhum detalhe encontrado para este pedido.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
