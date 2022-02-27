import React, { useState } from "react";
import SearchIcon from "../assets/search-icon-big.svg";
import "../styles/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [clicked, setClicked] = useState(false);
  const displaySearchBar = () => {
    setClicked(!clicked);
  };


  return (
    <section className="w-full px-6 py-8"> 
      <nav className="w-full flex justify-between items-center">
        <Link to={`/`}>
          <h3
            className={`${
              clicked === true ? "hidden" : "block"
            } font-black text-base`}
          >
            Sopuluchukwu
          </h3>
        </Link>
        <div
          className={`${
            clicked === true ? "available" : "input xxs:hidden"
          } w-full`}
        >
          <input
            type="text"
            name="search"
            className="w-full p-2 outline-none border border-gray-300 rounded-md"
            id="search"
            placeholder="Search"
            autoFocus={true}
          />
        </div>
        <img
          src={SearchIcon}
          className={`${clicked === true ? "hidden" : "block"}`}
          onClick={displaySearchBar}
          alt="search-icon"
        />
      </nav>
      
      <div className="w-full mt-5 divider"></div>
      {/* <div className="w-full border-8">
        <ul>
          <li>Test result</li>
        </ul>
      </div> */}
    </section>
  );
};

export default Header;
