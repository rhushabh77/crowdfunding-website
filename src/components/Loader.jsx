import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="cssload-main top-[45%]">
      <div className="cssload-heart">
        <span className="cssload-heartL"></span>
        <span className="cssload-heartR"></span>
        <span className="cssload-square"></span>
      </div>
      <div className="cssload-shadow"></div>
    </div>
  );
};

export default Loader;
