import React from "react";

import "./style.css";

const Section = (props) => {
  return (
    <section className="section">
      <div className="category-wraper">
        <div className="category">
          <p>Smartphones</p>
        </div>
        <div className="category">
          <p>Smart TV</p>
        </div>
        <div className="category">
          <p>Eletrodomésticos</p>
        </div>
        <div className="category">
          <p>Informática</p>
        </div>
        <div className="category">
          <p>Games</p>
        </div>
      </div>
    </section>
  );
};

export default Section;
