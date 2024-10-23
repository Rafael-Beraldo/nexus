import React, { useState } from "react";

import { ShoppingCart, Person } from "@mui/icons-material";
import Badge from "@mui/material/Badge";

import "./style.css";
import commonStyles from "../../styles/commonStyles.module.css";
import Input from "../Input";

// import logo from "./assets/logo.png";

const Header = () => {
  const [cartItems, setCartItems] = useState(0);

  return (
    <header className="header">
      <div className={commonStyles.container}>
        <div className="small-column">
          <div className="logo">
            {/* <img src={logo} alt="Logo Nexus" style={{}} /> */}
          </div>
        </div>
        <div className="big-column">
          <Input placeholder="Pesquisar..." />
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
            />
          </Badge>
          <Person style={{ width: 35, height: 35, cursor: "pointer" }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
