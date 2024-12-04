// import axios from "axios";

// const API_URL = "https://api.exchangerate-api.com/v4/latest/USD"; // Adjust the URL based on the API documentation

// export const fetchExchangeRates = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data.rates; // Assuming the API returns rates in this format
//   } catch (error) {
//     console.error("Error fetching exchange rates:", error);
//     throw error; // Rethrow the error for handling in the calling function
//   }
// };

import axios from "axios";

const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

export const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Return a default rates object if the fetch fails
    return { USD: 1, INR: 84.69 };
  }
};
