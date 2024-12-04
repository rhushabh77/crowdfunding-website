import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import Heart from "@/components/Heart";

const HomePage = () => {
  return (
    <>
      {/* <Header /> */}
      <section className="">
        <HeroSection />
      </section>
      <section className="">
        <ProductsSection />
      </section>
      <Heart
        position="absolute" // Positioning type
        bottom="20px" // Bottom positioning
        right="20px" // Right positioning
        width="100px" // Custom width
        height="100px" // Custom height
        zIndex="10" // Z-index
        className="custom-heart" // Additional CSS classes
        style={{ margin: "20px" }} // Additional inline styles
      />
      <Footer />
    </>
  );
};

export default HomePage;
