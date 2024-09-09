"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

interface Donation {
  Month?: string;
  Amount?: string;
  TotalAmount?: number;
}

interface DonationsChartProps {
  donationData: Record<string, Donation[]>; // Updated type to match the new data structure
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DonationsChart: React.FC<DonationsChartProps> = ({ donationData }) => {
  // Calculate the total amount for each month
  const monthlyTotals = Object.entries(donationData).reduce<Record<string, number>>((acc, [month, donations]) => {
    const monthName = monthsOrder[parseInt(month, 10) - 1]; // Convert '01' to 'Jan', '02' to 'Feb', etc.
    acc[monthName] = donations.reduce((total, { Amount }) => total + parseFloat(Amount ?? '0'), 0);
    return acc;
  }, {});

  const chartData = {
    labels: monthsOrder,
    datasets: [
      {
        label: 'Total Donations',
        data: monthsOrder.map(month => monthlyTotals[month] || 0),
        backgroundColor: 'rgba(135, 126, 255, 0.5)',
        borderColor: 'rgba(135, 126, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Amount ($)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container h-[400px]">
      <h2 className="text-center text-xl font-bold mb-4">Monthly Donations</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DonationsChart;
