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
  const [loading, setLoading] = useState(false); // Variável de loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o loading durante o processo de login
    try {
      const response = await fetch("http://localhost:5047/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao realizar login. Verifique suas credenciais.");
      }

      const data = await response.json();
      const { token } = data;

      // Armazenando o token e configurando a autenticação
      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"));

      setIsAuthenticated(true);

      // Buscando dados do usuário logo após login
      await fetchUserData(token);

      // Navegando para a página de usuário
      navigate("/user");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5047/api/User/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      console.log("Dados do usuário:", responseData); // Verifique os dados recebidos

      if (!response.ok) {
        // A mensagem de erro da resposta pode ser útil
        throw new Error(
          responseData.message || "Erro ao buscar os dados do usuário."
        );
      }

      // Se a resposta estiver correta, armazene os dados do usuário no estado
      setUser(responseData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      setError(error.message); // Atualiza a mensagem de erro
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
                <button
                  className="btn-form"
                  type="submit"
                  disabled={loading} // Desativa o botão enquanto carrega
                >
                  {loading ? "Carregando..." : "Entrar"}{" "}
                  {/* Altera o texto do botão durante o carregamento */}
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
