import React, { useState, useEffect } from "react";

import "./style.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Product from "../Product";

const Carousel = (props) => {
  const [loading, setLoading] = useState(true);

  const settings = {
    centerMode: true,
    centerPadding: "40px",
    slidesToShow: 3,
    infinite: true,
    speed: 500,
    responsive: [
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  useEffect(() => {
    if (props.products || props.banners) {
      setLoading(false);
    }
  }, [props.products]);

  const ProductsComponent = () => {
    return (
      <div style={{ padding: "40px" }}>
        <Slider {...settings}>
          {props.products.map((product) => (
            <div key={product.id} className="slide">
              <Product product={product} />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className="loading">
          <div className="loader">Carregando...</div>
        </div>
      ) : props.products?.length > 0 ? (
        <ProductsComponent />
      ) : null}
    </>
  );
};

export default Carousel;
