import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContributionPage from "./pages/ContributionPage";
import ThankYouPage from "./pages/ThankYouPage";
import CrowdfundingResultsPage from "./pages/CrowdfundingResultsPage.jsx";
import { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";

function App() {
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const loadData = async () => {
      // Simulate data loading
      // await new Promise((resolve) => setTimeout(resolve, 1900)); // Simulate a delay
      setLoading(false); // Set loading to false after data is loaded
    };
    loadData();
  }, []);
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: { background: "#4caf50", color: "white" },
          },
          error: {
            duration: 3000,
            style: { background: "#f44336", color: "white" },
          },
        }}
      />
      {loading ? ( // Conditional rendering based on loading state
        <Loader /> // Render the Loader component while loading
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contribute/:id" element={<ContributionPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/results" element={<CrowdfundingResultsPage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
