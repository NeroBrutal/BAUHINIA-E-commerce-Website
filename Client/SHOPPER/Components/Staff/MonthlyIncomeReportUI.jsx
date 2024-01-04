import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MonthlyIncomeReportUI = () => {
  const [monthlyIncomeData, setMonthlyIncomeData] = useState(null);

  useEffect(() => {
    const fetchMonthlyIncomeData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/monthlyIncomeReport');
        setMonthlyIncomeData(response.data);
      } catch (error) {
        console.error('Error fetching monthly income data:', error);
        alert('Failed to fetch monthly income data.');
      }
    };

    fetchMonthlyIncomeData();
  }, [monthlyIncomeData]); // Pass an empty dependency array to run the effect only once

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Monthly Income Report</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Month</th>
            <th className="py-2 px-4 border-b">Income</th>
          </tr>
        </thead>
        <tbody>
          {monthlyIncomeData && (
            <tr>
              <td className="py-2 px-4 border-b">Current Month</td>
              <td className="py-2 px-4 border-b">{monthlyIncomeData.totalIncome}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyIncomeReportUI;
