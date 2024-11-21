import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);
      setIsAuthenticated(true);
      fetchUserData(token);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

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

      if (!response.ok) {
        throw new Error(
          responseData.message || "Erro ao buscar os dados do usuário."
        );
      }

      setUser(responseData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = (newToken, userData) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
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
