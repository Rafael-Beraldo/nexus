import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Section from "../components/Section";
import Product from "../components/Product";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const clearCategory = () => {
    setSelectedCategory("");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const halfwayIndex = Math.ceil(filteredProducts.length / 2);
  const firstHalf = filteredProducts.slice(0, halfwayIndex);
  const secondHalf = filteredProducts.slice(halfwayIndex);

  return (
    <div>
      <Header onSearch={handleSearch} />
      <Section onCategorySelect={handleCategorySelect} />

      <div className={commonStyles.center}>
        <div className={commonStyles.width_70}>
          {selectedCategory && (
            <div className={commonStyles.categorySelected}>
              <p>
                Categoria selecionada: <strong>{selectedCategory}</strong>
              </p>
              <button
                onClick={clearCategory}
                className={commonStyles.clearButton}
              >
                Limpar categoria
              </button>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <>
              {searchTerm === "" && !selectedCategory && (
                <>
                  <Carousel products={firstHalf} />
                  <Carousel products={secondHalf} />
                </>
              )}
              <div className={commonStyles.productList}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={commonStyles.productItem}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
