import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Services", to: "/services" },
  { name: "Login", to: "/login" },
  { name: "Sign Up / Register", to: "/register" },
  { name: "About Us", to: "/about" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full z-30 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="rounded-xl bg-gray-500 text-white px-4 py-2 text-2xl font-serif italic transition hover:bg-white hover:text-black"
        >
          LS
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="sm:hidden block text-blue-600 text-3xl focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="material-icons">{open ? "close" : "menu"}</span>
        </button>

        {/* Nav Items (desktop) */}
        <ul className="hidden sm:flex space-x-6 items-center">
          {navLinks.map((item) => (
            <li key={item.name} className="relative group">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `relative px-3  rounded-lg transition-all duration-200 font-semibold
                  ${isActive
                    ? "text-blue-600 bg-gray-200 shadow-lg"
                    : "text-zinc-700 hover:text-blue-600 hover:bg-blue-100 "
                  }`
                }
                end={item.to === "/"}
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full duration-300"></span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden absolute left-0 top-full w-full bg-gray-900 bg-opacity-95 text-white shadow-lg">
          <ul className="flex flex-col text-lg">
            {navLinks.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-6 py-4 border-b border-gray-800 transition
                    ${isActive
                      ? "bg-blue-700 text-white"
                      : "hover:bg-blue-600"
                    }`
                  }
                  onClick={() => setOpen(false)}
                  end={item.to === "/"}
                >
                  {item.name}
                </NavLink>
              </li>
              ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;