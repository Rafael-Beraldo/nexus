import React, { useEffect, useState } from "react";

import commonStyles from "../styles/commonStyles.module.css";

import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Section from "../components/Section";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        console.log(data[0].category);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const halfwayIndex = Math.ceil(products.length / 2);
  const firstHalf = products.slice(0, halfwayIndex);
  const secondHalf = products.slice(halfwayIndex);

  return (
    <div>
      <Header />
      <Section />

      <div className={commonStyles.center}>
        <div className={commonStyles.width_70}>
          <div>
            <p>AAAAAA</p>
            <Carousel banners />
          </div>
          <div>
            <Carousel products={firstHalf} /> <Carousel products={secondHalf} />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
