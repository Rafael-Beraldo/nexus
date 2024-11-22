import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ProductForm.css";

const ProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productFromState = location.state?.product;

  const [product, setProduct] = useState({
    id: productFromState?.id || "",
    name: productFromState?.name || "",
    description: productFromState?.description || "",
    price: productFromState?.price || 0,
    category: productFromState?.category || "",
    image: productFromState?.imageUrl || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prev) => ({ ...prev, image: file }));
  };

  const handlePriceInputChange = (e) => {
    const value = e.target.value;

    const formattedValue = value.replace(/[^\d,]/g, "");

    const numericValue = parseFloat(formattedValue.replace(",", "."));

    setProduct((prev) => ({
      ...prev,
      price: isNaN(numericValue) ? "" : formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let price = parseFloat(product.price.replace(",", "."));

    if (isNaN(price)) {
      alert("Preço inválido");
      return;
    }

    const formData = new FormData();
    formData.append("Name", product.name);
    formData.append("Description", product.description);
    formData.append("Price", price.toFixed(2));
    formData.append("Category", product.category);

    if (product.image) {
      formData.append("Image", product.image);
    }

    try {
      let response;
      if (product.id) {
        response = await axios.put(
          `https://nexus-backend-latest.onrender.com/api/Product/${product.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Produto atualizado com sucesso!");
        navigate(`/produto/${product.id}`);
      } else {
        response = await axios.post(
          "https://nexus-backend-latest.onrender.com/api/Product",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Produto criado com sucesso!");
        navigate(`/produto/${response.data.id}`);
      }
    } catch (error) {
      console.error("Erro ao processar produto:", error);
      alert("Erro ao processar produto.");
    }
  };

  return (
    <div>
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
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              placeholder="Nome..."
              className="inputForm"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              id="description"
              placeholder="Descrição..."
              name="description"
              value={product.description}
              className="inputForm"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              id="price"
              placeholder="Preço..."
              name="price"
              value={product.price}
              className="inputForm"
              onChange={handlePriceInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              id="category"
              placeholder="Categoria..."
              name="category"
              className="inputForm"
              value={product.category}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <input
              type="file"
              className="inputForm"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="container-button">
            <button className="btn-form" type="submit">
              {product.id ? "Atualizar Produto" : "Criar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
