import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Cart.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import logo from "../assets/logo.png";
import { AuthContext } from "../auth/AuthContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [installments, setInstallments] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const initialOptions = {
    clientId:
      "AaKfNymjl48o2itp9lUil3FuP80HdjrFAd_yk6YQofIETcAPirvuYrwXRuVxW_nZXIJHCGTMFdpu5XGA",
    currency: "BRL",
  };

  // Carregar os itens do carrinho do localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };

    loadCartItems();
  }, []);

  // Calcular o total do carrinho
  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    };

    calculateTotal();
  }, [cartItems]);

  const createOrderInBackend = async (paymentDetails) => {
    try {
      // Criação dos dados do pedido com base nos itens do carrinho
      const orderData = {
        userId: user.id, // Id do usuário autenticado
        cartItems: cartItems.map((item) => ({
          productId: item.id, // Id do produto
          quantity: item.quantity, // Quantidade comprada
          total: item.price * item.quantity, // Preço total por produto
        })),
        total: totalPrice, // Total da compra
        paymentDetails: paymentDetails, // Detalhes do pagamento
      };

      // Enviar dados para o backend via POST
      const response = await fetch("http://localhost:5047/api/Order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar o token de autenticação (se necessário)
        },
        body: JSON.stringify(orderData), // Converter os dados para o formato JSON
      });

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao criar o pedido.");
      }

      // Se o pedido foi criado com sucesso, exibir mensagem e redirecionar para a página de pedidos
      alert("Transação concluída com sucesso! Pedido registrado.");
      navigate("/orders");
    } catch (error) {
      console.error("Erro ao criar pedido:", error.message);
      alert("Erro ao criar o pedido. Tente novamente.");
    }
  };

  if (cartItems.length === 0) return <div>Seu carrinho está vazio</div>;

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
      <div className="cartPage">
        <div className="cartContainer">
          {cartItems.map((item) => (
            <div key={item.id} className="cartItem">
              <div className="imageContainer">
                {item.imageUrl ? (
                  <img
                    src={`http://localhost:5047/${item.imageUrl}`}
                    alt={item.name}
                    className="productImage"
                  />
                ) : (
                  <p>Imagem não disponível</p>
                )}
              </div>
              <div className="cartItemDetails">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <label className="priceProduct">
                  R${item.price.toFixed(2)}
                </label>
                <div>
                  <label>Quantidade:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedCart = cartItems.map((cartItem) =>
                        cartItem.id === item.id
                          ? { ...cartItem, quantity: Number(e.target.value) }
                          : cartItem
                      );
                      setCartItems(updatedCart);
                      localStorage.setItem("cart", JSON.stringify(updatedCart));
                    }}
                    min="1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="totalPrice">
          <p>Total a pagar: R${totalPrice.toFixed(2)}</p>
        </div>

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
    </PayPalScriptProvider>
  );
};

export default CartPage;
