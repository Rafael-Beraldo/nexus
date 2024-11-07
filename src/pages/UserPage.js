import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./UserPage.css";

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
    setUser(formData);
    setIsEditing(false);

    localStorage.setItem("userData", JSON.stringify(formData));
  };

  if (!user) return <div>Carregando dados do usuário...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div style={{ paddingLeft: "2%" }}>
          <ArrowBackIcon
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
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
              <label>
                Nome:
                <input
                  type="text"
                  name="name.firstname"
                  value={formData.name.firstname}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="name.lastname"
                  value={formData.name.lastname}
                  onChange={handleChange}
                />
              </label>
              <label>
                Endereço:
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="address.number"
                  value={formData.address.number}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </label>
              <label>
                Telefone:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Salvar</button>
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
              <button className="edit-button" onClick={handleEditToggle}>
                Editar Perfil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
