import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const MiniNavbar = () => {
  return (
    <nav className="absolute top-6 right-6 z-20 md:top-4 sm:top-2 xs:top-1">
      <ul className="flex space-x-4 items-center">
        <li>
          <Link
            to="https://www.zola.com/wedding/komalandsaksham "
            target="_blank"
            className="text-gray-800 hover:text-gray-600 transition-colors duration-300 font-medium text-md"
          >
            Home
          </Link>
        </li>
        <li>
          <HashLink
            to="#registry"
            className="text-gray-800 hover:text-gray-600 transition-colors duration-300 font-medium text-sm"
          >
            Registry
          </HashLink>
        </li>
      </ul>
    </nav>
  );
};

export default MiniNavbar;
