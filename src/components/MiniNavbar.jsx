import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";

const AnimatedLink = ({
  children,
  to,
  external = false,
  smooth = false,
  className = "",
  ...props
}) => {
  // Animation variants
  const linkVariants = {
    initial: {
      scale: 1,
      opacity: 1,
    },
    hover: {
      scale: 1.05,
      opacity: 0.8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  // Underline animation
  const underlineVariants = {
    initial: {
      width: 0,
      opacity: 0,
    },
    hover: {
      width: "100%",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Choose the appropriate link component
  const LinkComponent = external ? "a" : smooth ? HashLink : Link;

  // Prepare link props
  const linkProps = external
    ? {
        href: to,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : { to, smooth };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="relative group inline-block"
    >
      <LinkComponent
        {...linkProps}
        {...props}
        className={`text-gray-800 hover:text-gray-600 transition-colors duration-300 font-medium text-sm flex flex-col items-center ${className}`}
      >
        <motion.span variants={linkVariants} className="inline-block">
          {children}
        </motion.span>
        <motion.span
          variants={underlineVariants}
          className="absolute -bottom-1 left-0 h-0.5 bg-gray-800 opacity-0 w-full"
        />
      </LinkComponent>
    </motion.div>
  );
};

const MiniNavbar = () => {
  return (
    <nav className="absolute top-6 right-6 z-20 md:top-4 sm:top-2 xs:top-1">
      <ul className="flex space-x-6 items-center">
        <li>
          <AnimatedLink
            to="https://www.zola.com/wedding/komalandsaksham"
            external
          >
            Home
          </AnimatedLink>
        </li>
        <li>
          <AnimatedLink to="#registry" smooth>
            Registry
          </AnimatedLink>
        </li>
      </ul>
    </nav>
  );
};

export default MiniNavbar;
