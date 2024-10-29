import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Section from "../components/Section";
import Product from "../components/Product";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  
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

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const halfwayIndex = Math.ceil(filteredProducts.length / 2);
  const firstHalf = filteredProducts.slice(0, halfwayIndex);
  const secondHalf = filteredProducts.slice(halfwayIndex);

  return (
    <div>
      <Header onSearch={handleSearch} />
      <Section />

      <div className={commonStyles.center}>
        <div className={commonStyles.width_70}>
          {filteredProducts.length > 0 ? (
            <>
              <div className={commonStyles.productList}>
                {filteredProducts.map(product => (
                    <div key={product.id} className={commonStyles.productItem}>
                      <Product product={product} />
                    </div>
                  ))}
              </div>
              {searchTerm === "" && (
                <>
                  <Carousel products={firstHalf} />
                  <Carousel products={secondHalf} />
                </>
              )}
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
