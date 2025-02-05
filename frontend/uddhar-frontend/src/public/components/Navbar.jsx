/*
  Purpose: "Navbar component for the website",
  Functionality: "Displays the Navbar of the website",
*/
import { useState } from "react";
import { Link } from "react-router-dom";

import cross from "../../assets/cross-icon.svg";
import logo from "../../assets/uddhar.png";

import { navLinks } from "../data/Data";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <nav className="top-0 left-0 right-0 w-full">
        <div>
          <div className="bg-amber-300 flex justify-between items-center px-15 h-17 max-md:px-7">
            <div>
              <img src={logo} alt="Logo" className="min-w-30 min-h-30 w-30" />
            </div>
            <div className="flex gap-10 max-lg:hidden">
              {navLinks.map((link, index) => (
                <p key={index} className="text-lg hover:text-gray-500">
                  <Link to={link.path}>{link.name}</Link>
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowMenu(true)}
              className="hidden max-lg:block text-2xl "
            >
              ☰
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Side Panel */}
      <div
        className={`fixed top-0 right-0 w-50 h-full bg-gray-100 shadow-lg z-30 p-4 transform transition-transform duration-500 ease-in-out 
            ${showMenu ? "translate-x-0" : "translate-x-full"} z-50`}
      >
        {/* translate-x-full (hidden) and translate-x-0 (visible)*/}
        <div className="flex flex-col h-full">
          <img
            src={cross}
            alt="Close"
            width={30}
            height={30}
            className="self-end mb-4 mr-4 cursor-pointer"
            onClick={() => setShowMenu(false)}
          />
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <p key={index} className="text-lg" onClick={() => setShowMenu(false)}>
                <Link to={link.path}>{link.name}</Link>
              </p>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
