/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// ReportUI.js
import { useState, useEffect } from "react";
import axios from "axios";

const ReportUI = ({ onClose }) => {
  const [reportData, setReportData] = useState([]);

  const fetchReportData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/allProducts");
      const reportData = response.data.map((product) => ({
        name: product.name,
        quantity: product.quantity || 0,
      }));
      setReportData(reportData);
    } catch (error) {
      console.error("Error fetching product data for report:", error);
      alert("Failed to generate product availability report.");
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Product Availability Report</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Product Name</th>
            <th className="py-2 px-4 border-b">Available Quantity</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((product) => (
            <tr key={product.name}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportUI;
