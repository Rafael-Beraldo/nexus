import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Order.css";

const OrderPage = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(
            `https://nexus-backend-latest.onrender.com/api/Order/user/${user.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar pedidos.");
          }

          const data = await response.json();

          const updatedOrders = data.map((order) => {
            const totalAmount = order.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
            return { ...order, totalAmount };
          });

          setOrders(updatedOrders);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user, token]);

  return (
    <div>
      <div className="profile-header">
        <ArrowBackIcon
          fontSize="small"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
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
      <div className="order-container">
        <div className="order-page">
          <h2>Histórico de Pedidos</h2>

          {loading ? (
            <p className="loading-text">Carregando pedidos...</p>
          ) : error ? (
            <p className="error-text">Erro ao carregar pedidos: {error}</p>
          ) : orders.length === 0 ? (
            <p>Você não possui pedidos registrados.</p>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <h3>Pedido #{order.id}</h3>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Total:</strong> R${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
