import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Download, Loader2, TrendingUp, Coins, Archive } from "lucide-react";
import { fetchExchangeRates } from "@/lib/exchangeRate";

// CSV Export Utility
const downloadCSV = (data, totalContribution, productTotals) => {
  // Create CSV headers for contributions
  const headers = ["Name", "Product", "Amount", "Currency", "Date", "Time"];

  // Convert data to CSV rows
  const csvRows = data.map((contribution) => {
    const date = new Date(contribution.createdAt);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`; // Format date
    const formattedTime = `${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`; // Format time

    return [
      contribution.name,
      contribution.productId.name || "N/A",
      contribution.amount,
      contribution.currency,
      formattedDate, // Use the formatted date
      formattedTime, // Use the formatted time
    ];
  });

  // Combine headers and rows for contributions
  const contributionsContent = [
    headers.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  // Create headers and rows for totals
  const totalsHeaders = ["Total Contribution", totalContribution];
  const productTotalsRows = Object.entries(productTotals).map(
    ([productId, { name, total }]) => `${name},${total}`
  );

  // Combine headers and rows for totals
  const totalsContent = [totalsHeaders.join(","), ...productTotalsRows].join(
    "\n"
  );

  // Combine contributions and totals into one CSV content
  const csvContent = `${contributionsContent}\n\nProduct Totals:\n${totalsContent}`;

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "crowdfunding_contributions.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const CrowdfundingResultsPage = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalContributionUSD, setTotalContributionUSD] = useState(0);
  const [totalContributionINR, setTotalContributionINR] = useState(0);
  const [productTotals, setProductTotals] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/contributions`
      );

      // Ensure the response structure is as expected
      const contributionsData = Array.isArray(response.data)
        ? response.data
        : response.data.contributions
        ? response.data.contributions
        : [];

      console.log("Fetched Contributions Data:", contributionsData); // Debugging line

      // Calculate total contributions
      const totalUSD = contributionsData.reduce((acc, contribution) => {
        console.log("Contribution:", contribution); // Debugging line
        return (
          acc + (contribution.currency === "usd" ? contribution.amount : 0)
        );
      }, 0);

      // Update totalINR to be totalUSD multiplied by 84.69
      const totalINR = totalUSD * 84.69;

      // Update state with contributions and totals
      setContributions(contributionsData);
      setTotalContributionUSD(totalUSD);
      setTotalContributionINR(totalINR);
      setError(null);
    } catch (error) {
      console.error("Detailed Error:", error.response || error);
      setContributions([]);
      setError(error.message || "Failed to fetch contributions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(); // Initial fetch
    const intervalId = setInterval(fetchContributions, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const convertToINR = (amount) => {
    if (exchangeRates.INR) {
      return amount * exchangeRates.INR; // Convert USD to INR using the exchange rate
    }
    return null; // Return null if exchange rate is not available
  };

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 p-4"
      >
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="bg-rose-500 text-white rounded-t-xl">
            <CardTitle className="flex items-center">
              <Archive className="mr-3 h-6 w-6" />
              Data Loading Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-rose-800 bg-rose-50 p-3 rounded-md">{error}</p>
            <Button
              variant="destructive"
              className="w-full bg-rose-600 hover:bg-rose-700 transition-colors"
              onClick={fetchContributions}
            >
              Retry Fetching
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            {
              title: "Total Contribution (USD)",
              value: `$${totalContributionUSD.toLocaleString()}`,
              icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
              bgColor: "from-blue-100 to-blue-200",
              textColor: "text-blue-600",
            },
            {
              title: "Total Contribution (INR)",
              value: `₹${totalContributionINR.toLocaleString()}`,
              icon: <Coins className="h-8 w-8 text-green-500" />,
              bgColor: "from-green-100 to-green-200",
              textColor: "text-green-600",
            },
            {
              title: "Number of Contributors",
              value: contributions.length,
              icon: <Archive className="h-8 w-8 text-purple-500" />,
              bgColor: "from-purple-100 to-purple-200",
              textColor: "text-purple-600",
            },
          ].map((card, index) => (
            <Card
              key={card.title}
              className={`bg-gradient-to-br ${card.bgColor} border-none shadow-lg transform transition-all hover:scale-105`}
            >
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 mb-2">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
                {card.icon}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <Card className="shadow-2xl border-none rounded-xl overflow-hidden">
          <CardHeader className="bg-white/80 backdrop-blur-sm flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Crowdfunding Results
              </CardTitle>
              <CardDescription className="text-gray-500">
                Comprehensive breakdown of all contributions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
              onClick={() =>
                downloadCSV(contributions, totalContributionUSD, productTotals)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardHeader>
          <div className="w-full h-1 bg-slate-700"></div>
          <CardContent className="px-0">
            {contributions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                <p>No contributions found.</p>
              </motion.div>
            ) : (
              <div
                className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 relative"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgb(147, 197, 253) rgb(191, 219, 254)",
                }}
              >
                <Table>
                  <TableHeader className="bg-white/90 sticky top-0 z-50 shadow-sm">
                    <TableRow className="border-b-2 border-blue-200">
                      {[
                        "Name",
                        "Product",
                        "Amount",
                        "Currency",
                        "Date",
                        "Time",
                        "Originally Paid in",
                      ].map((header) => (
                        <TableHead
                          key={header}
                          className="text-gray-700 font-semibold uppercase tracking-wider text-xs py-4"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {contributions.map((contribution) => (
                        <motion.tr
                          key={contribution._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          as={TableRow}
                          className="hover:bg-gray-50 transition-colors even:bg-gray-50/50"
                        >
                          <TableCell className="font-medium text-gray-700">
                            {contribution.name}
                          </TableCell>
                          <TableCell>
                            <CardDescription className="text-gray-600">
                              {contribution.productId.name}
                            </CardDescription>
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {contribution.amount
                              ? contribution.amount.toFixed(2)
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {contribution.currency === "usd" ? "$" : "₹"}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(contribution.createdAt).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour12: false,
                              }
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(contribution.createdAt).getHours()}:
                            {String(
                              new Date(contribution.createdAt).getMinutes()
                            ).padStart(2, "0")}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {contribution.isConverted ? "INR" : "USD"}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CrowdfundingResultsPage;
