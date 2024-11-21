import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./UserForm.css";
import logo from "../assets/logo.png";

const UserForm = (props) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [imageUrl, setImageUrl] = useState("exemplo");
  const [phone, setPhone] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://nexus-backend-latest.onrender.com/api/User`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            street,
            number,
            city,
            imageUrl,
            phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao realizar login. Verifique suas credenciais.");
      }

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="profile-header">
        <div style={{ paddingLeft: "2%" }}>
          <ArrowBackIcon
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <img
            src={logo}
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
      <div className="form-container">
        <div className="user-form">
          <form onSubmit={handleCreateUser}>
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
            <input
              type="text"
              value={firstName}
              className="inputForm"
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nome"
              maxLength={100}
            />
            <input
              type="text"
              value={lastName}
              className="inputForm"
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Sobrenome"
              maxLength={100}
            />
            <input
              type="text"
              value={street}
              className="inputForm"
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Rua"
              maxLength={100}
            />
            <input
              type="text"
              value={number}
              className="inputForm"
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Número da Residência"
              maxLength={100}
            />
            <input
              type="text"
              value={city}
              className="inputForm"
              onChange={(e) => setCity(e.target.value)}
              placeholder="Cidade"
              maxLength={100}
            />
            <input
              type="text"
              value={phone}
              className="inputForm"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefone"
              maxLength={100}
            />
            <div className="container-button">
              <button className="btn-form" type="submit">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserForm;
