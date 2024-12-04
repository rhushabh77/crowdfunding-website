import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Check, DollarSign, Search, Filter } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchExchangeRates } from "@/lib/exchangeRate";

const ProductsSection = () => {
  const [currency, setCurrency] = useState("usd");
  const [sortBy, setSortBy] = useState("everything");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(84.69);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.4:5000/api/products"
        );
        // const response = await axios.get(
        //   "http://192.168.1.3:5000/api/products"
        // );

        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRate(rates.INR || 84.69);
      } catch (error) {
        console.error("Could not fetch exchange rates:", error);
      }
    };

    fetchProducts();
    fetchRates();
  }, []);

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency");
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    localStorage.setItem("currency", value);
  };

  const filteredProducts = (products || [])
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const calculateRemaining = (product) => {
        return currency === "usd"
          ? product.amount.usd -
              product.collected.usd +
              product.amount.inr / exchangeRate -
              product.collected.inr / exchangeRate
          : product.amount.usd * exchangeRate -
              product.collected.usd * exchangeRate +
              product.amount.inr -
              product.collected.inr;
      };

      if (sortBy === "remaining") {
        return calculateRemaining(b) - calculateRemaining(a);
      } else if (sortBy === "funded") {
        const calculateFundedPercentage = (product) => {
          const totalAmountInSelectedCurrency =
            currency === "usd"
              ? product.amount.usd + product.amount.inr / exchangeRate
              : product.amount.usd * exchangeRate + product.amount.inr;

          return product.collected[currency] / totalAmountInSelectedCurrency;
        };

        return calculateFundedPercentage(b) - calculateFundedPercentage(a);
      }
      return 0;
    });

  return (
    <section className="bg-gradient-to-tr from-violet-200 via-white to-violet-200 py-16 sm:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6 sm:mb-0">
            Our Gift Registry
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow min-w-[250px]">
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-[180px] border-gray-300 focus:ring-2 focus:ring-indigo-500 rounded-full">
                  <Filter className="mr-2 w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everything">Everything</SelectItem>
                  <SelectItem value="remaining">Remaining</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-[120px] border-gray-300 focus:ring-2 focus:ring-indigo-500 rounded-full">
                  <DollarSign className="mr-2 w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-2xl text-gray-500 mb-4">No gifts found</p>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const totalAmountInUSD = product.amount.usd;
              const collectedAmountInUSD = product.collected.usd;

              const remainingAmount =
                currency === "usd"
                  ? totalAmountInUSD - collectedAmountInUSD
                  : totalAmountInUSD * exchangeRate -
                    collectedAmountInUSD * exchangeRate;

              const percentageCollected =
                (collectedAmountInUSD / totalAmountInUSD) * 100;

              return (
                <Link
                  key={product._id}
                  to={`/contribute/${product._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {collectedAmountInUSD === totalAmountInUSD && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2 shadow-md">
                          <Check className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-evenly">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                          {product.name}
                        </h3>

                        <div className="space-y-3 mt-4">
                          <div className="flex justify-between text-sm text-gray-700">
                            <span className="flex items-center">
                              {currency === "usd" ? (
                                <DollarSign className="w-4 h-4 mr-1 text-indigo-600" />
                              ) : (
                                <span className="w-4 h-4 mr-1 text-indigo-600">
                                  ₹
                                </span>
                              )}
                              {remainingAmount.toLocaleString()} remaining
                            </span>
                            <span className="font-semibold">
                              {percentageCollected.toFixed(2)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 rounded-full h-2.5 transition-all duration-500"
                              style={{ width: `${percentageCollected}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center text-indigo-600 font-semibold group-hover:text-indigo-800 transition">
                        <span>Contribute Now</span>
                        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
