import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Search } from "lucide-react";

// Memoized Blob component with reduced computational complexity
const Blob = React.memo(({ className }) => {
  const animationVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
      opacity: [0.3, 0.5, 0.3],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div
      className={`absolute rounded-full mix-blend-multiply filter blur-xl ${className}`}
      {...animationVariants}
    />
  );
});

// Optimized AnimatedLink with simplified animation logic
const AnimatedLink = React.memo(({ to, children, isActive, onClick }) => {
  const linkVariants = {
    hover: {
      y: "-100%",
      scaleX: 1,
    },
    tap: {
      y: "-100%",
      scaleX: 1,
    },
  };

  return (
    <motion.div
      className="inline-block relative overflow-hidden group"
      whileHover="hover"
      whileTap="tap"
    >
      <Link
        to={to}
        onClick={onClick}
        className={`text-[#DAD7CD] hover:text-[#A3B18A] transition-colors ${
          isActive ? "font-bold" : ""
        }`}
      >
        <div className="relative overflow-hidden">
          <motion.div
            className="inline-block"
            variants={{
              hover: { y: "-100%" },
              tap: { y: "-100%" },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <span className="inline-block">{children}</span>
            <span className="inline-block absolute left-0 top-full">
              {children}
            </span>
          </motion.div>
        </div>
        <motion.span
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#A3B18A] origin-left ${
            isActive ? "scale-x-100" : "scale-x-0"
          }`}
          variants={{
            hover: { scaleX: 1 },
            tap: { scaleX: 1 },
          }}
          initial={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  );
});

// Simplified IconLink component
const IconLink = React.memo(({ to, children, className }) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <Link
      to={to}
      className={`text-[#DAD7CD] hover:text-[#A3B18A] transition-colors ${className}`}
    >
      {children}
    </Link>
  </motion.div>
));

// Memoized NavItems with improved performance
const NavItems = React.memo(({ items, isActive, isMobile, onItemClick }) => {
  return (
    <>
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, [isMobile ? "x" : "y"]: -20 }}
          animate={{ opacity: 1, [isMobile ? "x" : "y"]: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <AnimatedLink
            to={item.path}
            isActive={isActive(item.path)}
            onClick={onItemClick}
          >
            {item.name}
          </AnimatedLink>
        </motion.div>
      ))}
    </>
  );
});

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const navItems = useMemo(
    () => [
      { name: "Products", path: "/products" },
      { name: "About Us", path: "/about-us" },
      { name: "Contact Us", path: "/contact-us" },
    ],
    []
  );

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <header className="relative overflow-hidden p-4 md:p-6 rounded-3xl">
      {/* Positioning blobs for visual interest */}
      <Blob className="bg-green-200 -top-10 -left-10 w-64 h-64" />
      <Blob className="bg-green-300 top-1/2 -right-10 w-48 h-48" />

      <div className="relative z-10 flex justify-between items-center">
        {/* Logo section with animation */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-[#A3B18A] rounded-full mr-2" />
            <h1 className="text-2xl font-bold">Food Export</h1>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavItems items={navItems} isActive={isActive} isMobile={false} />
        </nav>

        {/* Desktop Icons */}
        <motion.div
          className="hidden md:flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconLink to="/search" className="mr-2">
            <Search size={20} />
          </IconLink>
          <IconLink to="/cart">
            <ShoppingCart size={20} />
          </IconLink>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <motion.button
          className="md:hidden"
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden mt-4 space-y-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NavItems
              items={navItems}
              isActive={isActive}
              isMobile={true}
              onItemClick={closeMenu}
            />
            <div className="flex space-x-4 mt-2">
              <IconLink to="/search">
                <Search size={20} />
              </IconLink>
              <IconLink to="/cart">
                <ShoppingCart size={20} />
              </IconLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default React.memo(Header);
