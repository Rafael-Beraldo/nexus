import React, { useState } from "react";

import "./style.css";
import commonStyles from "../../styles/commonStyles.module.css";

import { useNavigate } from "react-router-dom";
import { ShoppingCart, Person } from "@mui/icons-material";
import Badge from "@mui/material/Badge";

import Input from "../Input";

const Header = ({ onSearch }) => {
  const [cartItems, setCartItems] = useState(0);
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <header className="header">
      <div className={commonStyles.container}>
        <div className="small-column">
          <div className="logo">
            {/* <img src={logo} alt="Logo Nexus" style={{}} /> */}
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
