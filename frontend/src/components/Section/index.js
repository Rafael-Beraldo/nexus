import React from "react";
import "./style.css";

const mapCategoriesToPortuguese = (categories) => {
  return categories.map(({ apiCategory, displayName }) => ({
    apiCategory,
    displayName,
  }));
};

const Section = ({ onCategorySelect }) => {
  const categories = [
    { apiCategory: "Smartphone", displayName: "Celulares" },
    { apiCategory: "Acessorios", displayName: "Acessórios" },
    { apiCategory: "Roupas", displayName: "Roupas" },
    { apiCategory: "Eletrodomesticos", displayName: "Eletrodomesticos" },
  ];

  const mappedCategories = mapCategoriesToPortuguese(categories);

  return (
    <section className="section">
      <div className="category-wraper">
        {mappedCategories.map(({ apiCategory, displayName }) => (
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
