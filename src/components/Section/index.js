import React from "react";
import "./style.css";

const Section = ({ onCategorySelect }) => {
  const categories = [
    { apiCategory: "electronics", displayName: "Eletrônicos" },
    { apiCategory: "jewelery", displayName: "Joias" },
    { apiCategory: "men's clothing", displayName: "Roupas Masculinas" },
    { apiCategory: "women's clothing", displayName: "Roupas Femininas" },
  ];

  return (
    <section className="section">
      <div className="category-wraper">
        {categories.map(({ apiCategory, displayName }) => (
          <div
            key={apiCategory}
            className="category"
            onClick={() => onCategorySelect(apiCategory)}
          >
            <p>{displayName}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section;
