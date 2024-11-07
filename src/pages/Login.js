import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

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
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
