import React, { createContext, useState, useEffect } from "react";

// Criação do contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado do usuário
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Verifica se o token existe no localStorage ao inicializar o contexto
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);
      setIsAuthenticated(true);
      fetchUserData(token); // Busca os dados do usuário com o token
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Função para buscar os dados do usuário com base no token
  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5047/api/User/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Erro ao buscar os dados do usuário."
        );
      }

      setUser(responseData); // Armazena os dados do usuário no estado
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      setIsAuthenticated(false); // Caso haja erro, desautentica o usuário
      setUser(null); // Limpa os dados do usuário
    }
  };

  const login = (newToken, userData) => {
    setToken(newToken); // Define o novo token
    localStorage.setItem("token", newToken); // Armazena o token no localStorage
    setIsAuthenticated(true);
    setUser(userData); // Define os dados do usuário
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove o token do localStorage
    setIsAuthenticated(false);
    setUser(null); // Limpa os dados do usuário
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
