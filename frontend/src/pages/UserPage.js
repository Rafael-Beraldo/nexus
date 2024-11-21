import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./UserPage.css";
import logo from "../assets/logo.png";
import { AuthContext } from "../auth/AuthContext";

const UserPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    number: "",
    city: "",
    phone: "",
    email: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    street: false,
    number: false,
    city: false,
    phone: false,
    email: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://nexus-backend-latest.onrender.com/api/User/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User Data:", data);

        setId(data.id);
        console.log("aa", data);
        setUser(data);
        setFormData(data);
      })
      .catch((error) =>
        console.error("Erro ao buscar dados do usuário:", error)
      );
  }, [navigate, setUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      street: !formData.street,
      number: !formData.number,
      city: !formData.city,
      phone: !formData.phone,
      email: !formData.email,
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token não encontrado! Por favor, faça login novamente.");
      return;
    }

    try {
      const response = await fetch(
        `https://nexus-backend-latest.onrender.com/api/User/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.email,
            password: "123",
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.street,
            number: formData.number,
            city: formData.city,
            imageUrl: "",
            phone: formData.phone,
          }),
        }
      );

      if (response.status === 204) {
        console.log("Usuário atualizado com sucesso");
      } else if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error("Erro na requisição");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }

    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="profile-container">
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
      {user ? (
        <div className="profile-wraper">
          <h1>Ficha do Usuário:</h1>
          <div className="profile-settings">
            <img
              src={user.imageUrl || "https://via.placeholder.com/150"}
              alt="Foto de Perfil"
              className="profile-picture"
            />
            <h2 className="profile-name">
              {user.firstName} {user.lastName}
            </h2>
            <p className="profile-email">{user.email}</p>
          </div>
          <div className="profile-section">
            <h3 className="section-title">Informações Pessoais</h3>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-user-wrapper">
                  <div className="form-user">
                    <div className="form-user-line">
                      <label style={{ fontSize: 14 }}>
                        Nome:
                        <input
                          type="text"
                          name="firstName"
                          className="input-user-form"
                          onChange={handleChange}
                          value={formData.firstName}
                        />
                      </label>
                    </div>

                    <div className="form-user-line">
                      <label style={{ fontSize: 14 }}>
                        Sobrenome:
                        <input
                          type="text"
                          name="lastName"
                          className="input-user-form"
                          onChange={handleChange}
                          value={formData.lastName}
                        />
                      </label>
                    </div>
                    <div className="form-user-line">
                      <label style={{ fontSize: 14 }}>
                        Telefone:
                        <input
                          type="text"
                          name="phone"
                          className="input-user-form"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="form-user">
                    <div className="form-user-line">
                      <label style={{ fontSize: 14 }}>
                        Rua:
                        <input
                          type="text"
                          name="street"
                          className="input-user-form"
                          value={formData.street}
                          onChange={handleChange}
                        />
                      </label>
                    </div>

                    <div className="form-user-line">
                      <label style={{ fontSize: 14 }}>
                        Número:
                        <input
                          type="text"
                          name="number"
                          className="input-user-form"
                          value={formData.number}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div className="form-user-line">
                      Cidade:
                      <label style={{ fontSize: 14 }}>
                        <input
                          type="text"
                          name="city"
                          className="input-user-form"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="container-button2">
                  <button className="btn-form" type="submit">
                    Salvar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p>
                  <strong>Nome:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Endereço:</strong> {user.street}, {user.number} -{" "}
                  {user.city}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {user.phone}
                </p>
                <div className="container-button2">
                  <button className="btn-form" onClick={handleEditToggle}>
                    Editar
                  </button>
                  <button
                    className="btn-form marginTop"
                    onClick={() => {
                      navigate("/order");
                    }}
                  >
                    Pedidos
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      marginTop: 5,
                      color: "red",
                      fontSize: 11,
                      fontWeight: "lighter",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    Desconectar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default UserPage;
