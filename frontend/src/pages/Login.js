import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./Login.css";
import logo from "../assets/logo.png";

const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://nexus-backend-latest.onrender.com/api/User/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao realizar login. Verifique suas credenciais.");
      }

      const data = await response.json();
      const { token } = data;

      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"));

      setIsAuthenticated(true);

      await fetchUserData(token);

      navigate("/user");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        "https://nexus-backend-latest.onrender.com/api/User/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      console.log("Dados do usuário:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.message || "Erro ao buscar os dados do usuário."
        );
      }

      setUser(responseData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      setError(error.message);
    }
  };

  const createUser = () => {
    navigate("/user/form");
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
                className="inputForm"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                maxLength={100}
                required
              />
              <input
                type="password"
                value={password}
                className="inputForm"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
              />
              <div className="container-button">
                <button className="btn-form" type="submit" disabled={loading}>
                  {loading ? "Carregando..." : "Entrar"}{" "}
                </button>
                <button
                  type="button"
                  onClick={createUser}
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
                  Criar Usuário
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
