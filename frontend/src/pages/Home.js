import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Section from "../components/Section";
import Product from "../components/Product";
import axios from "axios";
import ChatWidget from "../components/ChatWidget";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://nexus-backend-latest.onrender.com/api/Product"
        );
        setProducts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
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

  const filteredProducts = products.filter(
    (product) =>
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || product.category === selectedCategory)
  );

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

          {loading ? (
            <p>Carregando produtos...</p>
          ) : filteredProducts.length > 0 ? (
            <>
              {searchTerm === "" && !selectedCategory && (
                <>
                  <Carousel products={filteredProducts} />
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

      <ChatWidget />
    </div>
  );
};

export default HomePage;
