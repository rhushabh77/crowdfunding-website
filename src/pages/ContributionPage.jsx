import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  DollarSign,
  ArrowRight,
  Copy,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchExchangeRates } from "@/lib/exchangeRate";
import Loader from "@/components/Loader";

const ContributionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(84.69);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: { usd: "", inr: "" },
      currency: "usd",
      name: "",
      remarks: "",
      isConverted: false,
    },
  });
  const amount = watch("amount") || { usd: "", inr: "" };

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency");
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://komalandsaksham.vercel.app/api/products/${id}`
        );
        setProduct(response.data);
        calculateRemainingAmount(response.data);
      } catch (error) {
        toast.error("Could not fetch product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      calculateRemainingAmount(product);
    }
  }, [currency, product, exchangeRate]);

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRate(rates.INR);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        setExchangeRate(84.69);
      }
    };

    getExchangeRate();
  }, []);

  const calculateRemainingAmount = (productData) => {
    const totalAmountInUSD = productData.amount.usd;
    const collectedAmountInUSD = productData.collected.usd;

    if (currency === "usd") {
      setRemainingAmount(totalAmountInUSD - collectedAmountInUSD);
    } else {
      const totalAmountInINR = totalAmountInUSD * exchangeRate;
      const collectedAmountInINR = collectedAmountInUSD * exchangeRate;
      setRemainingAmount(totalAmountInINR - collectedAmountInINR);
    }
  };

  const handleAmountChange = (value) => {
    const numValue = parseFloat(value || "0");

    if (currency === "usd") {
      setValue("amount", {
        usd: value,
        inr: isNaN(numValue) ? "" : (numValue * exchangeRate).toFixed(2),
      });
    } else {
      setValue("amount", {
        usd: isNaN(numValue) ? "" : (numValue / exchangeRate).toFixed(2),
        inr: value,
      });
    }
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    localStorage.setItem("currency", value);
    calculateRemainingAmount(product);
  };

  const copyToClipboard = (text) => {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);

    // Select the text
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    try {
      // Attempt to copy using document.execCommand (works on most browsers)
      const successful = document.execCommand("copy");
      if (successful) {
        toast.success("Copied to clipboard!");
      } else {
        toast.error("Failed to copy");
      }
    } catch (err) {
      // Fallback for modern browsers
      try {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            toast.success("Copied to clipboard!");
          })
          .catch(() => {
            toast.error("Failed to copy");
          });
      } catch {
        toast.error("Copying not supported");
      }
    }

    // Remove the temporary textarea
    document.body.removeChild(textArea);
  };

  const onSubmit = async (data) => {
    try {
      let contributionAmount = parseFloat(data.amount[currency]);
      const contributionData = {
        productId: id,
        name: data.name,
        remarks: data.remarks,
        amount: contributionAmount,
        currency: currency === "inr" ? "inr" : "usd",
        paymentMethod: currency === "usd" ? "venmo" : "upi",
        isConverted: false,
      };

      if (currency === "inr") {
        contributionAmount = contributionAmount / exchangeRate;
        contributionData.isConverted = true;
        contributionData.currency = "usd";
      }

      contributionData.amount = contributionAmount;

      const totalAmountInUSD = product.amount.usd;
      const collectedAmountInUSD = product.collected.usd;

      const remainingAmount = totalAmountInUSD - collectedAmountInUSD;

      if (contributionAmount > remainingAmount) {
        toast.error(
          `Contribution cannot exceed ${remainingAmount.toLocaleString()} USD`
        );
        return;
      }

      const response = await axios.post(
        `https://crowdfunding-backend-3wkh.onrender.com/api/contributions`,

        contributionData
      );

      if (response.status === 201) {
        toast.success("Contribution submitted successfully");
        navigate(`/`);
      } else {
        toast.error("Failed to submit contribution");
      }
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast.error("Failed to submit contribution");
    }
  };

  if (isLoading) {
    return (
      // <div className="flex justify-center items-center min-h-screen bg-gray-50">
      //   <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      // </div>
      <Loader />
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-4 sm:p-8 bg-white shadow-md rounded-lg">
          <p className="text-lg sm:text-xl text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  const totalAmountInUSD = product.amount.usd;
  const collectedAmountInUSD = product.collected.usd;
  const percentageCollected = (collectedAmountInUSD / totalAmountInUSD) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-4 sm:mb-6 transition"
        >
          <ChevronLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Back to Gifts
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side: Product Details */}
          <div className="p-4 sm:p-8 bg-indigo-50/50">
            <div className="aspect-video rounded-xl overflow-hidden mb-4 sm:mb-6 shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-900">
              {product.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              {product.description}
            </p>

            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-md">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-sm sm:text-base text-gray-600">
                  Remaining Amount
                </span>
                <span className="text-base sm:text-lg font-bold text-indigo-600 flex items-center">
                  {currency === "usd" ? "$" : "₹"}
                  {remainingAmount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (product.collected.usd / product.amount.usd) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Contribution Form */}
          <div className="p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">
              Make a Contribution
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <Label className="text-gray-700 mb-1 sm:mb-2">Your Name</Label>
                <Input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Enter your name"
                  className="text-sm sm:text-base border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-none"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    Name is required
                  </p>
                )}
              </div>

              <div>
                <Label className="text-gray-700 mb-1 sm:mb-2">
                  Remarks (Optional)
                </Label>
                <Textarea
                  {...register("remarks")}
                  placeholder="Add a message with your contribution"
                  rows={3}
                  className="text-sm sm:text-base border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-none"
                />
              </div>

              <div>
                <Label className="text-gray-700 mb-1 sm:mb-2">
                  Contribution Amount
                </Label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex-grow">
                    <Input
                      type="number"
                      {...register("amount.usd")}
                      value={currency === "usd" ? amount.usd : amount.inr}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="text-sm sm:text-base border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-none"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <Select
                      value={currency}
                      onValueChange={handleCurrencyChange}
                    >
                      <SelectTrigger className="w-full sm:w-[120px] text-sm sm:text-base border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-none">
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

              <div>
                <Label className="text-gray-700 mb-1 sm:mb-2">
                  Payment Details
                </Label>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 sm:p-5">
                  {currency === "usd" ? (
                    <div className="flex flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                      <div className="flex-grow">
                        <p className="text-sm sm:text-base font-semibold text-indigo-800">
                          Venmo Payment
                        </p>
                        <a
                          href="https://venmo.com/u/ksachdeva"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-indigo-600 underline break-all"
                        >
                          https://venmo.com/u/ksachdeva
                        </a>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard("https://venmo.com/u/ksachdeva")
                        }
                        className="flex items-center text-xs sm:text-sm"
                      >
                        <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        Copy
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                      <div className="flex-grow">
                        <p className="text-sm sm:text-base font-semibold text-indigo-800">
                          UPI Payment
                        </p>
                        <a
                          href="upi://pay?pa=9650523639@ybl&pn=Contribution&am=0"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-indigo-600 underline break-all"
                        >
                          9650523639@ybl
                        </a>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard("9650523639@ybl")}
                        className="flex items-center text-xs sm:text-sm"
                      >
                        <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-lg hover:bg-indigo-700 
                focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all 
                flex items-center justify-center group text-sm sm:text-base"
              >
                Contribute
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionPage;
