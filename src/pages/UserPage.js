import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./UserPage.css";
import logo from "../assets/logo.png";

const UserPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: { firstname: "", lastname: "" },
    address: { street: "", number: "", city: "" },
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstname: false,
    lastname: false,
    address: false,
    phone: false,
    email: false,
  });

  const nameRef = useRef();
  const lastnameRef = useRef();
  const streetRef = useRef();
  const numberRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser(storedUser);
      setFormData(storedUser);
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("name.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        name: { ...prevData.name, [field]: value },
      }));
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [field]: value },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (isEditing) {
      validationErrors = {
        firstname: !formData.name.firstname,
        lastname: !formData.name.lastname,
        street: !formData.address.street,
        number: !formData.address.number,
        city: !formData.address.city,
        phone: !formData.phone,
        email: !formData.email,
      };
    } else {
      validationErrors = {
        firstname: !nameRef.current?.value,
        lastname: !lastnameRef.current?.value,
        street: !streetRef.current?.value,
        number: !numberRef.current?.value,
        city: !cityRef.current?.value,
        phone: !phoneRef.current?.value,
        email: !emailRef.current?.value,
      };
    }

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      return;
    }

    setUser(formData);
    setIsEditing(false);
    localStorage.setItem("userData", JSON.stringify(formData));
    alert("Usuário atualizado com sucesso!");
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
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
              src="https://via.placeholder.com/150"
              alt="Foto de Perfil"
              className="profile-picture"
            />
            <h2 className="profile-name">
              {user.name.firstname} {user.name.lastname}
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
                          name="name.firstname"
                          className="input-user-form"
                          onChange={handleChange}
                          value={formData.name.firstname}
                        />
                      </label>
                    </div>

                    <div className="form-user-line">
                      <label style={{ fontSize: 14 }}>
                        Sobrenome:
                        <input
                          type="text"
                          name="name.lastname"
                          className="input-user-form"
                          onChange={handleChange}
                          value={formData.name.lastname}
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
                          name="address.street"
                          className="input-user-form"
                          value={formData.address.street}
                          onChange={handleChange}
                        />
                      </label>
                    </div>

                    <div className="form-user-line">
                      <label style={{ fontSize: 14 }}>
                        Número:
                        <input
                          type="text"
                          name="address.number"
                          className="input-user-form"
                          value={formData.address.number}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div className="form-user-line">
                      Cidade:
                      <label style={{ fontSize: 14 }}>
                        <input
                          type="text"
                          name="address.city"
                          className="input-user-form"
                          value={formData.address.city}
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
                  <strong>Nome:</strong> {user.name.firstname}{" "}
                  {user.name.lastname}
                </p>
                <p>
                  <strong>Endereço:</strong> {user.address.street},{" "}
                  {user.address.number} - {user.address.city}
                </p>
                <p>
                  <strong>Telefone:</strong> {user.phone}
                </p>
                <div style={{ textAlign: "center", padding: 5 }}>
                  <button className="edit-button" onClick={handleEditToggle}>
                    Editar Perfil
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
        <div className="profile-wraper">
          <form onSubmit={handleSubmit}>
            <input
              id="name"
              ref={nameRef}
              className={`inputForm ${errors.firstname ? "inputError" : ""}`}
              type="text"
              placeholder="Nome..."
              maxLength={32}
            />
            <input
              id="lastname"
              ref={lastnameRef}
              className={`inputForm ${errors.lastname ? "inputError" : ""}`}
              type="text"
              placeholder="Sobrenome..."
              maxLength={32}
            />
            <input
              id="street"
              ref={streetRef}
              className={`inputForm ${errors.street ? "inputError" : ""}`}
              type="text"
              placeholder="Rua..."
              maxLength={50}
            />
            <input
              id="number"
              ref={numberRef}
              className={`inputForm ${errors.number ? "inputError" : ""}`}
              type="text"
              placeholder="Número..."
              maxLength={50}
            />
            <input
              id="city"
              ref={cityRef}
              className={`inputForm ${errors.city ? "inputError" : ""}`}
              type="text"
              placeholder="Cidade..."
              maxLength={50}
            />
            <input
              id="phone"
              ref={phoneRef}
              className={`inputForm ${errors.phone ? "inputError" : ""}`}
              type="text"
              placeholder="Telefone..."
              maxLength={20}
            />
            <input
              id="email"
              ref={emailRef}
              className={`inputForm ${errors.email ? "inputError" : ""}`}
              type="text"
              placeholder="Email..."
              maxLength={32}
            />
            <div className="container-button">
              <button className="btn-form" type="submit">
                Criar Usuário
              </button>
              <button
                onClick={handleLogout}
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
                Já tenho usuário.
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserPage;
