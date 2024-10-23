import React, { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";

const Input = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    props.onSearch(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSearch = () => {
    props.onSearch(inputValue);
  };

  const styles = {
    inputContainer: {
      display: "flex",
      alignItems: "center",
    },

    input: {
      flexGrow: 1,
      padding: "10px",
      border: "1px solid #ccc",
      borderTopLeftRadius: "15px",
      borderBottomLeftRadius: "15px",
      borderTopRightRadius: "0",
      borderBottomRightRadius: "0",
      transition: "box-shadow 0.2s ease, outline 0.2s ease",
      outline: isFocused ? "2px solid rgba(155, 155, 155, 0.5)" : "none",
      boxShadow: isFocused ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
      fontFamily: "'Open Sans', sans-serif",
      fontWeight: "medium",
    },
    button: {
      padding: "7px 15px",
      border: "none",
      borderTopLeftRadius: "0",
      borderBottomLeftRadius: "0",
      borderTopRightRadius: "15px",
      borderBottomRightRadius: "15px",
      backgroundColor: "#8402da",
      color: "#FFFFFF",
      cursor: "pointer",
      transition: "background-color 0.3s",
      fontFamily: "'Open Sans', sans-serif",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.inputContainer}>
      <input
        style={styles.input}
        type={props.type}
        placeholder={props.placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button onClick={handleSearch} style={styles.button}>
        <SearchIcon />
      </button>
    </div>
  );
};

export default Input;
