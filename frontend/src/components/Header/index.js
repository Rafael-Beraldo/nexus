import React, { useState, useContext } from "react";

import "./style.css";
import commonStyles from "../../styles/commonStyles.module.css";

import { useNavigate } from "react-router-dom";
import { ShoppingCart, Person, Add } from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../auth/AuthContext";

import Input from "../Input";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(0);
  const { user, setUser } = useContext(AuthContext);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleAddProduct = () => {
    navigate("/product/form");
  };

  return (
    <header className="header">
      <div className={commonStyles.container}>
        <div className="small-column">
          <div className="logo">
            <img src={logo} style={{ width: 200, height: 60 }} />
          </div>
        </div>
        <div className="big-column">
          <Input placeholder="Pesquisar..." onSearch={onSearch} />
        </div>
        <div
          className="small-column"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Badge
            badgeContent={cartItems}
            color="secondary"
            style={{ marginRight: "15px" }}
          >
            {user && user.isAdmin ? (
              <Add
                style={{ width: 35, height: 35, cursor: "pointer" }}
                onClick={handleAddProduct}
              />
            ) : null}
            <ShoppingCart
              style={{ width: 35, height: 35, cursor: "pointer" }}
              onClick={handleCartClick}
            />
          </Badge>
          <Person
            style={{ width: 35, height: 35, cursor: "pointer" }}
            onClick={() => navigate("/user")}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
