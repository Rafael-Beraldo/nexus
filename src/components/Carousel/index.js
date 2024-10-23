import React from "react";
import "./style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "../Product";

const Carousel = ({ products }) => {
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

  return (
    <div style={{ padding: "40px" }}>
      <Slider {...settings}>
        {products.map((product) => (
          <div className="slide" key={product.id}>
            {" "}
            <Product product={product} />{" "}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
