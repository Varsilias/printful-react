import React from "react";
import '../styles/PrintfulLoader.css'

const Loader = () => {
  return (
    <section className="flex justify-center items-center">
      <div className="flex justify-center items-center loader_container">
        <div className="first h-8 w-2 bg-blue-300"></div>
        <div className="second h-8 w-2 bg-blue-300"></div>
        <div className="third h-8 w-2 bg-blue-300"></div>
      </div>
    </section>
  );
};

export default Loader;
