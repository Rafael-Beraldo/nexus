import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./Login.css";
import logo from "../assets/logo.png";

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Teste para Simular Usuário.
  const simulateLogin = (email, password) => {
    if (email === "teste@exemplo.com" && password === "123456") {
      return {
        token: "fake-jwt-token",
        userData: {
          name: { firstname: "Rafael", lastname: "Beraldo" },
          address: {
            street: "Rua Fictícia",
            number: "123",
            city: "Cidade Exemplo",
          },
          phone: "123-456-7890",
          email: "teste@exemplo.com",
        },
      };
    } else {
      throw new Error("Credenciais inválidas");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      const response = simulateLogin(email, password);
      const { token, userData } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsAuthenticated(true);
      navigate("/user");
    } catch (error) {
      setError("Erro ao realizar login. Verifique suas credenciais.");
    }
  };

  return (
    <div>
      <div className="profile-header" />
      <div className="login-section-wraper">
        <div className="login-section">
          <img src={logo} style={{ width: 200, height: 60 }} />
          <div className="login-form">
            <form onSubmit={handleLogin}>
              <input
                type="email"
                value={email}
                className={`inputForm`}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                maxLength={100}
                required
              />
              <input
                type="password"
                value={password}
                className={`inputForm`}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
              />
              <div className="container-button">
                <button className="btn-form" type="submit">
                  Entrar
                </button>
                <button
                  style={{
                    marginTop: 5,
                    color: "#000000",
                    fontSize: 11,
                    fontWeight: "lighter",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Esqueci a Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
