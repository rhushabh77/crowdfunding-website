import React from "react";
import roundShapeImage from "../assets/couple.png";
import logoImage from "../../public/logo.svg";
import backgroundImage from "@/assets/coupleimg.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat max-sm:bg-center min-h-screen flex items-center justify-between px-6 lg:px-20 py-12 overflow-hidden md:px-10 sm:px-6 xs:px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Logo Div */}
      <div className="absolute top-6 left-6 z-10 md:top-4 sm:top-2 xs:top-1">
        <img
          src={logoImage}
          alt="Komal & Saksham Wedding Logo"
          className="w-16 h-16 object-contain md:w-12 sm:w-10 xs:w-8"
        />
      </div>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/70 z-0" aria-hidden="true" />

      <div className="mainlayout relative z-20 flex items-end max-sm:flex-wrap md:flex-col sm:flex-col xs:flex-col">
        <div className="max-w-lg md:max-w-md sm:max-w-sm xs:max-w-xs">
          <h1 className="text-9xl font-bold text-gray-900 max-md:text-5xl max-sm:text-4xl xs:text-3xl mb-4 ephesis-regular">
            Komal & Saksham
          </h1>
          <p className="text-lg text-gray-600 mb-2 md:text-md sm:text-sm xs:text-xs">
            24 January 2025
          </p>
          <p className="text-lg text-gray-600 font-semibold md:text-md sm:text-sm xs:text-xs">
            #SAKOON
          </p>
        </div>

        {/* Right Section (Gratitude Message) */}
        <div className="max-w-lg p-6 rounded-lg bg-white/60 flex md:max-w-md sm:max-w-sm xs:max-w-xs">
          <p className="text-lg text-gray-800 italic md:text-md sm:text-sm xs:text-xs">
            We're incredibly thankful to have everything we already need. So,
            we're skipping out of tradition and would love for you to help us
            create some new memories instead.
          </p>
        </div>
      </div>

      {/* Round Image with Animation and Hover Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute bottom-6 left-6 md:bottom-4 sm:bottom-2 xs:bottom-1"
        whileHover={{ scale: 1.05, rotate: 5, filter: "saturate(200%)" }}
      >
        <figure className="max-sm:pb-10">
          <img
            src={roundShapeImage}
            alt="Komal & Saksham"
            className="rounded-full h-24 w-24 sm:h-20 sm:w-20 lg:h-28 lg:w-28 md:h-20 md:w-20 xs:h-16 xs:w-16 object-cover p-1.5 border-2 border-black"
          />
        </figure>
      </motion.div>
    </div>
  );
};

export default HeroSection;
